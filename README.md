# Add Fine Grained Authorization to an Express + Typescript API

This is a simplified Express + Typescript document API, for the purpose of demonstrating Fine-grained authorization (FGA) using OpenFGA, with Auth0 as the identity provider.

> **Prerequisites:**
> - [Node 20.10.0](https://jdk.java.net/java-se-ri/21)
> - [Auth0 account](https://auth0.com/signup)
> - [Auth0 CLI 1.4.0](https://github.com/auth0/auth0-cli#installation)
> - [Docker 24.0.7](https://docs.docker.com/desktop/)
> - [FGA CLI v0.2.7](https://openfga.dev/docs/getting-started/install-sdk)

## Clone the API

To download the API project, execute the following commands:

```bash
git clone https://github.com/indiepopart/express-typescript-fga.git
cd express-typescript-fga/final
```

## Register the API to Auth0

Sign up at [Auth0](https://auth0.com/signup) and install the [Auth0 CLI](https://github.com/auth0/auth0-cli). Then in the command line run:

```shell
auth0 login
```

The command output will display a device confirmation code and open a browser session to activate the device.

Register the API within your tenant:

```shell
auth0 apis create \
  --name "Express API" \
  --identifier https://document-api.okta.com
```

The first line in the command output will contain your Auth0 domain.

## Run OpenFGA with docker

In the `final` dir, start up MongoDB and OpenFGA services:

```shell
docker compose up
```

Then initialize the authorization model store using the FGA CLI:

```shell
cd openfga
export FGA_API_URL=http://localhost:8090
fga store create --name "documents-fga"
```

Copy the store id and execute:

```shell
export FGA_STORE_ID=<store-id>
cd openfga
fga model write --store-id=${FGA_STORE_ID} --file auth-model.json
```

Copy de model id and set it as environment variable:

```shell
export FGA_MODEL_ID=<model-id>
```

## Run the Express API

Copy `.env.example` to `.env` and replace the Auth0 domain, the store id and model id:

```shell
PORT=6060
CLIENT_ORIGIN_URL=http://localhost:4040
AUTH0_AUDIENCE=https://document-api.okta.com
AUTH0_DOMAIN=<your-auth0-domain>

MONGODB_URI=mongodb://express-api:example@localhost:27017/documents

FGA_API_URL=http://localhost:8090
FGA_STORE_ID=<store-id>
FGA_MODEL_ID=<model-id>
```

In the `final` dir, run the API with:

```shell
npm install && npm run dev
```

## Test the API

Create a test access token:

```shell
auth0 test token -a https://document-api.okta.com -s openid
```

Save the access token in an environment variable:

```shell
ACCESS_TOKEN=<access-token>
```

Use the access token to make a request to the API. Create document:

```shell
curl -X POST \
  -H "Authorization:Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "planning.doc"}' \
  http://localhost:8080/document
```

## Add permission

For creating a permission to view the document, run this FGA CLI command:

```shell
fga tuple write --store-id=${FGA_STORE_ID} --model-id=$FGA_MODEL_ID 'user:<sub-claim>' viewer document:<document-id>
```

You can find the `sub` claim by decoding the access token at https://jwt.io/.

For example:

```shell
fga tuple write --store-id=${FGA_STORE_ID} --model-id=$FGA_MODEL_ID 'user:auth0|6434199152fb767f7eaed567' viewer document:66fd75790c1325dd8133f433
```

You can add other relationship for the user and document like `owner`, `writer`.


## Help

Please post any questions as comments on the [blog post](), or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).
