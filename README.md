# Students API

API REST pour la gestion des étudiants, réalisée avec **Express**, **TypeScript** et **PostgreSQL**.

## Objectifs de la séance

- Revoir les principes d'une API REST
- Implémenter un CRUD complet (Create, Read, Update, Delete)
- Centraliser la gestion des erreurs
- Tester une API avec Postman / Thunder Client

## Routes REST

| Action                        | Méthode HTTP | URL             | Code de succès |
|--------------------------------|:------------:|-----------------|:---------------:|
| Lister tous les étudiants      | GET          | /etudiants       | 200             |
| Lire un étudiant précis        | GET          | /etudiants/:id   | 200             |
| Créer un étudiant              | POST         | /etudiants       | 201             |
| Modifier un étudiant (complet) | PUT          | /etudiants/:id   | 200             |
| Modifier un étudiant (partiel) | PATCH        | /etudiants/:id   | 200             |
| Supprimer un étudiant          | DELETE       | /etudiants/:id   | 204             |

## Structure du projet

```
students-api/
├── migrations/
│   └── 001_create_students_table.sql
├── src/
│   ├── configuration/
│   │   └── database.ts
│   ├── controllers/
│   │   └── StudentController.ts
│   ├── models/
│   │   └── Student.ts
│   ├── repositories/
│   │   └── StudentRepository.ts
│   ├── scripts/
│   │   └── runMigrations.ts
│   ├── services/
│   │   └── StudentService.ts
│   └── index.ts
├── api-examples.http
├── package.json
└── tsconfig.json
```

## Installation

```bash
npm install
```

Copier `.env.example` en `.env` et renseigner la variable `DATABASE_URL` avec les
informations de votre base PostgreSQL.

## Lancer les migrations

```bash
npm run migrate
```

## Démarrer le serveur (mode développement)

```bash
npm run dev
```

## Build et démarrage (production)

```bash
npm run build
npm start
```

## Tester l'API

Utiliser le fichier `api-examples.http` avec l'extension **REST Client** (VS Code)
ou importer les mêmes requêtes dans **Postman** / **Thunder Client**.

## Gestion centralisée des erreurs

Le `StudentController` centralise la conversion des erreurs métier (levées par le
`StudentService`) en réponses HTTP appropriées :

- `Student not found` → 404
- `Email already exists` → 409
- Erreurs de validation (`Invalid student ID`, `First name is required`, ...) → 400
- Toute autre erreur → 500
