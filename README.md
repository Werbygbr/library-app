📚 Online Könyvtár – Library App
Teljes stack webalkalmazás könyvek és szerzők kezelésére.
🏗️ Technológiák
RétegTechnológiaFrontendAngular 21 + Angular MaterialBackendASP.NET 10 Web APIAdatbázisMongoDBKonténerizálásDocker + Docker ComposeOrchestrációKubernetes (Minikube)CI PipelineGitHub ActionsCD PipelineArgoCD (GitOps)

🚀 Gyors indítás (Docker Compose)
Előfeltételek

Docker Desktop telepítve és futó állapotban

Lépések
bash# 1. Klónozd a repo-t
git clone https://github.com/Werbygbr/library-app.git
cd library-app

# 2. Indítsd el az alkalmazást
docker-compose up --build
Megnyitás böngészőben

Alkalmazás: http://localhost:4200
API Swagger: http://localhost:8080/swagger

Leállítás
bashdocker-compose down

☸️ Kubernetes indítás (Minikube)
Előfeltételek

Docker Desktop
Minikube
kubectl

Lépések
bash# 1. Klónozd a repo-t
git clone https://github.com/Werbygbr/library-app.git
cd library-app

# 2. Indítsd el a Minikube clustert
minikube start

# 3. Deployold az alkalmazást
kubectl apply -f k8s/

# 4. Várj amíg minden pod elindul (1-2 perc)
kubectl get pods -w

# 5. Nyisd meg a böngészőben
minikube service frontend

⚠️ A terminált nyitva kell tartani amíg használod az alkalmazást!

Pod állapot ellenőrzése
bashkubectl get pods
kubectl get services
Minden pod Running állapotban kell legyen.

🔄 CI/CD Pipeline
GitHub Actions (CI)
Minden main branch-re történő push automatikusan:

Buildeli a backend Docker image-et
Buildeli a frontend Docker image-et
Feltölti őket a GitHub Container Registry-be (ghcr.io)

ArgoCD (CD)
Az ArgoCD folyamatosan figyeli a GitHub repo-t és automatikusan szinkronizálja a Kubernetes clustert.
ArgoCD UI elérése
bash# Port forward
kubectl port-forward svc/argocd-server -n argocd 8091:443
Majd nyisd meg: https://localhost:8091

User: admin
Password:

bash$encoded = kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}"
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($encoded))

📁 Projekt struktúra
library-app/
├── LibraryApi/                 # ASP.NET 10 Backend
│   ├── Controllers/            # REST API végpontok
│   ├── Models/                 # Book, Author modellek
│   ├── Services/               # CRUD üzleti logika
│   ├── Settings/               # MongoDB beállítások
│   ├── Dockerfile
│   └── appsettings.json
├── library-frontend/           # Angular 21 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Book, Author, Navbar komponensek
│   │   │   ├── models/         # TypeScript interfészek
│   │   │   └── services/       # HTTP service-ek
│   │   └── environments/       # Dev/prod környezeti változók
│   ├── Dockerfile
│   └── nginx.conf
├── k8s/                        # Kubernetes manifestek
│   ├── mongodb-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── argocd-application.yaml
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
└── docker-compose.yml

🌐 API végpontok
Könyvek
MethodEndpointLeírásGET/api/booksÖsszes könyv listázásaGET/api/books/{id}Egy könyv lekérésePOST/api/booksÚj könyv létrehozásaPUT/api/books/{id}Könyv módosításaDELETE/api/books/{id}Könyv törlése
Szerzők
MethodEndpointLeírásGET/api/authorsÖsszes szerző listázásaGET/api/authors/{id}Egy szerző lekérésePOST/api/authorsÚj szerző létrehozásaPUT/api/authors/{id}Szerző módosításaDELETE/api/authors/{id}Szerző törlése

💡 Funkciók

📚 Könyvek CRUD kezelése
✍️ Szerzők CRUD kezelése
📊 Dashboard statisztikák (összes könyv, szerzők, legújabb év, műfajok)
🔍 Könyv részletes nézet
📄 Lapozás (pagination)
📱 Responsive design
🎨 Modern Material Design UI
