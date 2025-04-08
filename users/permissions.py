from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'

class IsManagerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role in ['admin', 'manager']

class IsUserOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role in ['admin', 'user']
