# Mise en ligne Marketeria

Le frontend est une application Vite hébergeable sur Vercel. Le backend Laravel et MySQL ont besoin d'un serveur persistant. La configuration fournie utilise un VPS Linux avec Docker Compose; Caddy obtient automatiquement le certificat HTTPS. Le port MySQL n'est jamais publié sur Internet.

## 1. Préparer le VPS

- Créer un VPS Linux avec Docker Engine et Docker Compose v2.
- Acheter ou utiliser un nom de domaine et créer un enregistrement DNS `A` pour `api.votredomaine.dz` vers l'adresse IP du VPS.
- Autoriser les ports TCP 80 et 443 dans le pare-feu du VPS. Ne pas ouvrir le port MySQL 3306.
- Copier les dossiers `marketplace-backend` et `marketplace-frontend` sur le serveur sans copier `.env`, `.env.local`, `.vercel`, `node_modules`, `vendor` ou `database/database.sqlite`.

## 2. Configurer les secrets

Dans `marketplace-backend` sur le VPS :

```sh
cp .env.docker.example .env.docker
php artisan key:generate --show
```

Mettre la clé générée dans `APP_KEY` de `.env.docker`, puis remplacer le domaine d'exemple par le domaine API réel. Définir deux mots de passe MySQL forts et différents, ainsi que le domaine exact du frontend dans `CORS_ALLOWED_ORIGINS` (sans `/` final). Ne jamais transmettre ni versionner `.env.docker`.

## 3. Démarrer l'API et la base

Depuis `marketplace-backend` sur le VPS :

```sh
docker compose --env-file .env.docker up --build -d
docker compose --env-file .env.docker logs -f app caddy
```

Compose crée MySQL avec un volume persistant. L'API attend que MySQL soit prêt, puis exécute les migrations et insère les catégories initiales de façon idempotente à chaque démarrage. Laravel n'applique que les migrations manquantes; les catégories déjà présentes ne sont pas modifiées. Ne pas lancer le seeder général `php artisan db:seed` en production : les données de démonstration sont bloquées et ne doivent pas remplacer de vraies données.

Vérifier `https://api.votredomaine.dz/up`, puis `https://api.votredomaine.dz/api/v1/products`. Créer le compte administrateur depuis le terminal du VPS :

```sh
docker compose --env-file .env.docker exec app php artisan app:create-admin admin@votredomaine.dz --name="Administrateur Marketeria"
```

Le mot de passe est demandé de manière masquée. Conserver les identifiants dans un gestionnaire de mots de passe.

## 4. Relier et publier le frontend

Dans les paramètres du projet Vercel, ajouter la variable d'environnement de production :

```text
VITE_API_URL=https://api.votredomaine.dz/api/v1
```

Redéployer le frontend après avoir défini cette variable. Renseigner ensuite dans `CORS_ALLOWED_ORIGINS` l'origine exacte du frontend (par exemple `https://marketplace-client.vercel.app`), puis redémarrer l'API :

```sh
docker compose --env-file .env.docker up -d --force-recreate app
```

Dans Vercel, ouvrir **Deployments**, choisir le dernier déploiement réussi et cliquer **Visit**. Cette URL est le lien public à envoyer à la cliente. Tester depuis une fenêtre privée l'inscription client, la connexion, le catalogue, une commande, la persistance après reconnexion, puis la demande fournisseur et sa validation par l'administrateur.

## 5. Sauvegardes et mises à jour

- Sauvegarder régulièrement MySQL hors du VPS et tester la restauration.
- Garder les volumes `mysql_data` et `app_storage` lors des redéploiements.
- Pour déployer une mise à jour, récupérer le nouveau code puis exécuter `docker compose --env-file .env.docker up --build -d`.
- Ne jamais exécuter `docker compose down -v` sur les données réelles : `-v` supprime les volumes de la base et des fichiers.

## Limites à traiter avant des transactions réelles

Cette configuration rend l'API et la base hébergeables; elle ne crée pas le compte VPS, le DNS ou le projet Vercel, et ne constitue pas une validation métier complète. Les paiements en ligne, les transporteurs, les emails et les traitements IA doivent être reliés à leurs prestataires réels avant de les présenter comme actifs. Ne pas utiliser de vraies données clients avant tests de sécurité, sauvegardes et validation des obligations légales applicables.