<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Marketplace - Accueil</title>
</head>
<body>
    <h1>Nos produits</h1>
    <div class="products-grid">
        <?php $__currentLoopData = $products; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $p): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="product-card">
                <h3><?php echo e($p->name); ?></h3>
                <p><?php echo e($p->category->name); ?> - <?php echo e($p->supplier->shop_name); ?></p>
                <p><strong><?php echo e(number_format($p->price, 2)); ?> DA</strong></p>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>
</body>
</html><?php /**PATH C:\dev\marketplace-backend\resources\views/products/index.blade.php ENDPATH**/ ?>