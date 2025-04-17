from collections import defaultdict
from django.db import transaction
from rest_framework import serializers
from .models import Category, Product, ProductImage, Order, OrderItem
from django.conf import settings

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'product']

    def get_image_url(self, obj):
        if obj.image:
            return settings.MEDIA_URL + str(obj.image)
        return None

    def create(self, validated_data):
        product = validated_data.get('product')
        if not product:
            raise serializers.ValidationError("Product is required for ProductImage.")
        return super().create(validated_data)

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer): 
    product_id = serializers.IntegerField(write_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'quantity']

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value)
        except Product.DoesNotExist:
            raise serializers.ValidationError(f"Product with id {value} does not exist.")
        return value

    def create(self, validated_data):
        product = Product.objects.get(id=validated_data['product_id'])
        return OrderItem.objects.create(product=product, **validated_data)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'items']
        read_only_fields = ['user']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        item_dict = defaultdict(int)
        for item in items_data:
            item_dict[item['product_id']] += item['quantity']  # Суммируем количество по product_id

        with transaction.atomic():
            order = Order.objects.create(user=user)
            order_items = [
                OrderItem(order=order, product_id=product_id, quantity=quantity)
                for product_id, quantity in item_dict.items()
            ]
            OrderItem.objects.bulk_create(order_items)

        return order
