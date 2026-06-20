## NEXY SHOP backend integre

Le projet inclut maintenant un backend Next.js hebergeable pour:

- initialiser les paiements Moneroo cote serveur
- verifier les paiements apres retour client ou webhook
- envoyer les commandes payees a Astral4Gamer
- stocker les statuts de commande dans un store distant Upstash Redis

## Variables d'environnement

Copiez les variables de `.env.example` dans votre plateforme d'hebergement.

Points importants:

- `APP_URL` doit etre votre vraie URL publique, par exemple `https://nexyshop.com`
- `ASTRAL_API_KEY` doit rester cote serveur
- `MONEROO_SECRET_KEY` et `MONEROO_WEBHOOK_SECRET` doivent rester cote serveur
- `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` permettent un stockage distant, adapte a l'hebergement serverless
- `ASTRAL_PRODUCT_MAP_JSON` associe vos produits du site aux `product_id` Astral4Gamer

## Flux de commande

1. Le client ajoute une recharge ou une carte cadeau au panier.
2. Le panier appelle `POST /api/checkout/initialize`.
3. Le serveur recalcule les prix, signe la commande et initialise Moneroo.
4. Moneroo redirige le client vers `APP_URL/paiement/retour`.
5. Le webhook `POST /api/webhooks/moneroo` reverifie le paiement.
6. Si le paiement est `success`, le serveur cree les commandes reseller Astral4Gamer.
7. Le statut reste consultable via `GET /api/orders/:paymentId`.

## Endpoints disponibles

- `POST /api/checkout/initialize`
- `POST /api/webhooks/moneroo`
- `GET /api/orders/:paymentId`
- `GET /api/astral/products`
- `GET /api/astral/balance` avec header `x-admin-token` si `ADMIN_API_TOKEN` est configure
- `GET /api/astral/orders?...` avec header `x-admin-token` si `ADMIN_API_TOKEN` est configure
- `GET|POST|DELETE /api/admin/session`
- `GET /api/admin/overview`

## Page admin

Une page admin hebergeable est disponible sur `/admin`.

- connexion par `ADMIN_API_TOKEN`
- session stockee en cookie HTTP-only signe
- vue de l'etat de configuration
- solde Astral4Gamer
- lecture du catalogue fournisseur
- recherche par `paymentId`
- recherche par `partner_reference`

Si vous voulez isoler la signature de session du reste, ajoutez `ADMIN_SESSION_SECRET` en plus de `ADMIN_API_TOKEN`.

## Mapping Astral4Gamer

Le backend ne devine pas les `product_id` du fournisseur. Vous devez remplir `ASTRAL_PRODUCT_MAP_JSON` avec les IDs renvoyes par `GET /api/astral/products`.

Exemple:

```json
[
	{
		"productId": 123,
		"type": "giftcard",
		"slug": "google-play",
		"denomination": "5€"
	},
	{
		"productId": 456,
		"type": "game",
		"slug": "free-fire",
		"denomination": "100 Diamants",
		"region": "africa"
	}
]
```

## Deploiement

Exemple de commandes:

```bash
npm install
npm run build
npm run start
```

Pour la production, configurez aussi chez Moneroo:

- `return_url` vers `https://votre-domaine/paiement/retour`
- webhook vers `https://votre-domaine/api/webhooks/moneroo`

Sans store distant, le projet peut encore initier et verifier un paiement, mais la protection anti-doublon et l'historique de commande seront limites.
