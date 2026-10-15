<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Marketplace - Accueil</title>
</head>
<body>
    <h1>Nos produits</h1>
    <div class="products-grid">
        @foreach ($products as $p)
            <div class="product-card">
                <h3>{{ $p->name }}</h3>
                <p>{{ $p->category->name }} - {{ $p->supplier->shop_name }}</p>
                <p><strong>{{ number_format($p->price, 2) }} DA</strong></p>
            </div>
        @endforeach
    </div>
</body>
</html>