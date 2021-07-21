# blockchain-asset-tracker
Asset tracker using  BigchainDB

#### Login
- Login using Google
- Login using Facebook

### Getting Started

install dependencies and rename the env local example:

```bash
yarn install && mv .env.local.example .env.local
```

And run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Others

Reference for color branding [Green](https://colorhunt.co/palette/2f5d625e8b7ea7c4bcdfeeea)

### Status

| Epic | Description | Status | Notes |
|------|-------------|--------|-------|
| Auth | User login | Backlog | |
| Asset | Get list of assets | Done | |
| Asset | Asset detail | In-Progress | Error when retrieving transaction from Bigchain |
| Asset | Scan asset for status update | Backlog | |
| Asset | Create new assets | Done | |
| Warehouse | Superadmin - Get list of warehouses | Done ||
| Warehouse | Superadmin - Create new warehouse | Done ||
| Warehouse | Superadmin - Get warehouse detail | Done ||
| Warehouse | Superadmin - Create user in warehouse detail | Done |

### Application Architecture
![Image](./images/architecture-01.png?raw=true)
![Image](./images/architecture-02.png?raw=true)

### Example Blokchain Data
![Image](./images/blockchain-data.png?raw=true)