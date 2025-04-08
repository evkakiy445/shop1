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
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity']

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
            item_dict[item['product']] += item['quantity']

        with transaction.atomic():
            order = Order.objects.create(user=user)
            order_items = [
                OrderItem(order=order, product=product, quantity=quantity)
                for product, quantity in item_dict.items()
            ]
            OrderItem.objects.bulk_create(order_items)

        return order