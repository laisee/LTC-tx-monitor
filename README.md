[![Node.js CI](https://github.com/laisee/LTC-tx-monitor/actions/workflows/node.js.yml/badge.svg)](https://github.com/laisee/LTC-tx-monitor/actions/workflows/node.js.yml)
[![Dependabot Updates](https://github.com/laisee/LTC-tx-monitor/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/laisee/LTC-tx-monitor/actions/workflows/dependabot/dependabot-updates)

# LTC Transaction Monitor

A modern Node.js/Express application for monitoring Litecoin (LTC) addresses for incoming transactions.

## Features

- 🚀 **Modern JavaScript**: ES Modules, async/await, arrow functions
- 📦 **Latest Dependencies**: Express 5.x, Axios 1.x, Jest 30.x
- 🔍 **Code Quality**: ESLint, Prettier, JSDoc type annotations
- ✅ **Testing**: Comprehensive test suite with Jest
- 🛠️ **Developer Experience**: Nodemon for hot-reloading during development
- 📊 **Type Safety**: JSDoc annotations for better IDE support

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd LTC-tx-monitor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   export LTC_ADDRESS_LIST=address1,address2,address3
   export API_UPDATE_URL=https://your-api-endpoint.com/update
   export HEROKU_APP_NAME=your-app-name
   export HEROKU_RELEASE_VERSION=v1.0.0
   ```

## Usage

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## API Endpoints

### GET /
Health check endpoint that returns application name and version.

**Response:**
```json
{
  "name": "LTC-Test-Monitor",
  "version": "v1.0.0"
}
```

### POST /transaction/update
Retrieves and processes transactions for all monitored LTC addresses.

**Response:**
```json
{
  "status": 200,
  "count": 5,
  "total": 1.5
}
```

### GET /transaction/total
Retrieves the total balance for a specific LTC address.

**Response:**
```json
{
  "currency": "LTC",
  "total": 10.5,
  "timestamp": 1704672000000
}
```

## Deployment

### Heroku

1. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Set environment variables:
   ```bash
   heroku config:set LTC_ADDRESS_LIST=address1,address2,address3
   heroku config:set API_UPDATE_URL=https://your-api-endpoint.com/update
   ```

3. Deploy:
   ```bash
   git push heroku master
   ```

## Modernization Changes

This project has been updated to use the latest JavaScript tools and best practices:

### Dependencies
- ✅ Removed deprecated `body-parser` (now built into Express 4.16+)
- ✅ Removed deprecated `request` and `request-promise` packages
- ✅ Updated to Express 5.x
- ✅ Updated to latest Axios, Jest, and other dependencies

### Code Quality
- ✅ Converted from CommonJS to ES Modules
- ✅ Replaced callbacks with async/await
- ✅ Added ESLint with modern rules
- ✅ Added Prettier for consistent code formatting
- ✅ Added JSDoc type annotations for better IDE support
- ✅ Added jsconfig.json for enhanced IntelliSense

### Developer Experience
- ✅ Added nodemon for development hot-reloading
- ✅ Added comprehensive npm scripts
- ✅ Updated tests to use ES Modules
- ✅ Added Jest configuration for ES Modules support

## License

ISC
