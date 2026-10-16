# Civic Vigilance Backend

This folder contains the Civic Vigilance Node.js API, Supabase Edge Functions and migrations, and database schemas.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Vijendrapratap/Civic-Vigilance.git
   ```
2. Navigate to the backend directory:
   ```
   cd Civic-Vigilance/backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create the backend environment file and add the server-only secrets:
   ```
   cp .env.example .env
   ```

## Usage

To start the server, run the following command:
```
npm start
```
The server will be running on `http://localhost:3000`; API routes are mounted under `/api`.

Use `./setup-twitter-from-env.sh` to upload the Twitter values from `.env` to Supabase secrets.

## Testing

To run the tests, use the following command:
```
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
