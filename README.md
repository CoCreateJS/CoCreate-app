# CoCreate-app

A full-stack, zero-build application boilerplate and platform engine built on **CoCreateJS**. It unifies public marketing websites, secure user account portals, and multi-tenant admin dashboards into a single, cohesive HTML codebase. Powered by declarative HTML attributes and pure HTML templates, **CoCreate-app** enables developers to build real-time, offline-first web and mobile applications using standard HTML without mandatory build steps, JavaScript boilerplate, or heavy front-end framework lock-in.

---

## Documentation

For complete API references, HTML attribute specifications, UI customization, and native mobile compilation steps, refer to the [CoCreateJS Documentation](https://www.google.com/search?q=https://CoCreateJS.com/docs).

---

## Table of Contents

* [Overview](https://www.google.com/search?q=%23overview)
* [Features](https://www.google.com/search?q=%23features)
* [Architecture](https://www.google.com/search?q=%23architecture)
* [Declarative HTML Attributes](https://www.google.com/search?q=%23declarative-html-attributes)
* [Getting Started](https://www.google.com/search?q=%23getting-started)
* [Supported Application Suite](https://www.google.com/search?q=%23supported-application-suite)
* [Multi-Database & Parallel Sync](https://www.google.com/search?q=%23multi-database--parallel-sync)
* [Multi-Cloud & AST API Engine](https://www.google.com/search?q=%23multi-cloud--ast-api-engine)
* [Directory Structure](https://www.google.com/search?q=%23directory-structure)
* [Roadmap](https://www.google.com/search?q=%23roadmap)
* [How to Contribute](https://www.google.com/search?q=%23how-to-contribute)
* [License](https://www.google.com/search?q=%23license)

---

## Overview

**CoCreate-app** serves as both a production-ready application template and an architectural blueprint. It breaks down the traditional barriers between your forward-facing website, client portal, and internal management tools by providing a single, integrated platform starter.

Built with complete framework independence, the UI relies on **pure HTML templates** powered by **declarative CoCreateJS attributes**. You can use the entire system out of the box, remove components as needed, or strip the HTML templates entirely and consume the underlying CoCreateJS APIs inside any custom stack or native web view.

---

## Features

* **Three-In-One Platform Core:** Includes pre-built layouts and routing for Public Web, Account Management, and Platform Administration.
* **Declarative HTML Architecture:** Drive database queries, state management, real-time collaboration, and form handling directly using standard HTML attributes (`actions`, `array`, `object`, `key`, etc.).
* **Field-Level Access Control:** Fine-grained security permissions enforced down to individual document and element fields, preventing unauthorized reads or mutations at the attribute level.
* **Unified AST Third-Party API Engine:** Integrates with any third-party API using Abstract Syntax Tree (AST) parsing to transform external schemas into a single, standardized API handler.
* **Parallel Multi-Database Writing:** Simultaneously execute and sync CRUD operations across multiple SQL, NoSQL, vector, and edge databases in real-time.
* **Multi-Cloud Node Auto-Scaling:** Automatically manages, controls, and auto-scales server nodes in and out across multiple cloud providers.
* **Zero Build Step:** Runs directly in the browser via standard HTML files—no Webpack, Vite, or client-side compilation required.
* **Real-Time Collaboration:** Out-of-the-box multiplayer state and collaborative editing powered by the CoCreateJS Socket ecosystem.
* **Offline-First & Local Persistence:** Seamless client-side database caching using IndexedDB, allowing users to continue interacting offline while queueing background updates.
* **Mobile-Ready Hybrid Foundation:** Designed to wrap cleanly inside native iOS (Swift) and Android (Kotlin) shells via native bridge adapters.

---

## Architecture

**CoCreate-app** operates on a unified, modular hierarchy divided into three top-level functional zones:

```
                      +----------------------------------+
                      |           CoCreate-app           |
                      +----------------------------------+
                                       |
        +------------------------------+------------------------------+
        |                              |                              |
+---------------+              +---------------+              +---------------+
|    Website    |              |    Account    |              |     Admin     |
| (Public Site) |              | (User Portal) |              | (Control Hub) |
+---------------+              +---------------+              +---------------+
| • Landing     |              | • Profile     |              | • User Admin  |
| • Blog        |              | • Security    |              | • Org Settings|
| • Pricing     |              | • Subscriptions|              | • App Config  |
| • Docs        |              | • Activity    |              | • System Logs |
+---------------+              +---------------+              +---------------+

```

---

## Declarative HTML Attributes

**CoCreate-app** utilizes declarative attributes attached to standard HTML elements. The client-side runtime automatically observes these attributes, converting HTML form controls and containers into live, real-time database inputs without writing JavaScript.

### Example: Live Form Persistence with Field-Level Security

```html
<!-- Automatically creates or updates an object in the "users" array -->
<form array="users" object="64b9a32e18f21bc56789abcd">
  
  <!-- Real-time text input bound to the "name" key -->
  <input type="text" key="name" placeholder="Full Name" />

  <!-- Field-level access enforced on sensitive fields -->
  <input type="email" key="email" read-permission="admin" write-permission="owner" placeholder="Email Address" />

  <!-- Declarative submit action -->
  <button type="submit" actions="save">Save Profile</button>
  
</form>

```

### Example: Real-Time Data Fetching & Rendering

```html
<!-- Fetches records from the "blog" array and renders each item using a template -->
<div array="blog" filter='{"$limit": 10}'>
  
  <div template class="card">
    <h3 key="title">Post Title Placeholder</h3>
    <p key="summary">Summary placeholder...</p>
    <a href="/blog/{{_id}}">Read More</a>
  </div>

</div>

```

---

## Getting Started

### 1. Clone or Download the Template

Clone the repository to your local machine:

```bash
git clone https://github.com/cocreatejs/CoCreate-app.git
cd CoCreate-app

```

### 2. Serve the Project

Because **CoCreate-app** is made of pure HTML, CSS, and JS scripts, you can host or serve it using any web server, local development server, or static host (GitHub Pages, Vercel, Netlify, Nginx, or Live Server):

```bash
# Example using npx http-server
npx http-server .

```

Open your browser to the local address (e.g., `http://localhost:8080`) to explore the public website, `/account` portal, and `/admin` dashboard.

---

## Supported Application Suite

**CoCreate-app** includes ready-to-use, pure HTML application modules out of the box:

| Category | Modules Included |
| --- | --- |
| **Core & Users** | `activities`, `api-keys`, `apis`, `apps`, `members`, `organizations`, `profile`, `settings`, `users` |
| **Business & Sales** | `companies`, `contacts`, `leads`, `opportunities`, `estimates`, `invoices`, `orders`, `purchase-orders`, `sales-orders`, `sellers` |
| **Operations & HR** | `applicants`, `candidates`, `jobs`, `items`, `expenses`, `payments`, `projects`, `tasks`, `support-tickets` |
| **Content & Web** | `blog`, `posts`, `components`, `dashboards`, `files`, `notes`, `search`, `social` |
| **Communication** | `calendar`, `chat`, `email` |
| **Web3 & Infrastructure** | `crypto`, `nft`, `countries`, `diagnostics`, `servers` |

---

## Multi-Database & Parallel Sync

**CoCreate-app** leverages the CoCreateJS unified database engine, enabling applications to write concurrently across multiple database providers using a single standardized payload.

### Native Adapters Supported

* **Cloud SQL & Relational:** `CoCreate-auroradb`, `CoCreate-mariadb`, `CoCreate-mysql`, `CoCreate-oracledb`, `CoCreate-postgresql`, `CoCreate-planetscale`, `CoCreate-tidb`, `CoCreate-cockroachdb`
* **NoSQL & Document:** `CoCreate-mongodb`, `CoCreate-documentdb`, `CoCreate-dynamodb`, `CoCreate-firestore`, `CoCreate-cosmosdb`, `CoCreate-ferretdb`
* **Embedded & Edge DBs:** `CoCreate-indexeddb`, `CoCreate-sqlite`, `CoCreate-dqlite`, `CoCreate-rqlite`, `CoCreate-turso`
* **Vector, TimeSeries & Analytics:** `CoCreate-amazon-redshift`, `CoCreate-qdrant`, `CoCreate-timescaledb`
* **Bundler:** `CoCreate-storage-bundler`

---

## Multi-Cloud & AST API Engine

### Unified Third-Party API Engine (AST)

**CoCreate-app** processes external third-party APIs using Abstract Syntax Trees (AST). This allows developers to query and manipulate external REST, GraphQL, or RPC services through a single unified CoCreateJS API handler without writing custom wrapper logic for each provider.

### Multi-Cloud Infrastructure Auto-Scaling

`CoCreate-app` includes node management controls capable of managing, provisioning, and auto-scaling server nodes in and out across multiple cloud infrastructure providers (AWS, GCP, Azure, DigitalOcean, and Bare Metal) simultaneously.

---

## Directory Structure

```
CoCreate-app/
├── website/             # Public-facing web pages, landing, and blog templates
│   ├── index.html
│   ├── blog.html
│   └── pricing.html
├── account/             # Client portal and user management pages
│   ├── index.html
│   ├── profile.html
│   └── security.html
├── admin/               # Platform administration and system control
│   ├── index.html
│   ├── users.html
│   └── settings.html
├── assets/              # Shared CSS, images, and brand assets
├── docs/                # Component and attribute documentation
├── LICENSE
└── README.md

```

---

## Roadmap

Upcoming platform enhancements include:

* **Native CLI Export Commands:** One-command generation for Swift (`coc ios`) and Kotlin (`coc android`) native app projects.
* **Abstract Native Bridge Layer:** Direct mapping from standard browser APIs to native OS hardware (Camera, Biometrics, Push Notifications).
* **Enhanced Offline Outbox Engine:** Dedicated, high-performance IndexedDB transaction queue for disconnected network operations.
* **Visual UI Customizer:** Drag-and-drop template builder directly integrated into the Admin dashboard.

---

## How to Contribute

We welcome community contributions, bug reports, and feature requests. Please review our **CONTRIBUTING.md** guide before submitting pull requests or opening issues.

Join our community to discuss architecture, declarative patterns, and upcoming features.

---

## License

This software is dual-licensed under the GNU Affero General Public License version 3 (AGPLv3) and a commercial license.

* **Open Source Use:** Available under AGPLv3 for open-source projects and non-commercial exploration. See the `LICENSE` file for full terms.
* **Commercial Use:** Commercial organizations requiring proprietary use or exemption from AGPL provisions must acquire a commercial license through CoCreate.