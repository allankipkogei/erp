from rest_framework.routers import DefaultRouter
from .views import WarehouseViewSet, ItemViewSet, StockViewSet, StockTransactionViewSet

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet)
router.register(r'items', ItemViewSet)
router.register(r'stocks', StockViewSet)
router.register(r'transactions', StockTransactionViewSet)

urlpatterns = router.urls
