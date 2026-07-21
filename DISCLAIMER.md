# Legal Disclaimer

## Unofficial software

This package (`@myvciso/veriniceveo-sdk`) is an **unofficial, independently developed** client library for the publicly documented [verinice.veo](https://github.com/SerNet/verinice-veo) REST API.

It is **not** published, endorsed, sponsored, or supported by SerNet GmbH, the verinice project, or any of their affiliates.

## Trademarks

**verinice**, **verinice.veo**, **SerNet**, and related logos, product names, and brand features are trademarks or registered trademarks of SerNet GmbH (and/or its licensors) in Germany and other countries.

This project uses those names solely to identify the third-party product and API that the client talks to. **No trademark license is granted.** You may not use SerNet or verinice trademarks, logos, or branding in a way that suggests affiliation, sponsorship, or endorsement.

When redistributing or embedding this SDK, do not include SerNet or verinice logos, and do not present this software as an official SerNet/verinice product.

## Relationship to upstream software

The verinice.veo server and related microservices are open-source software published by SerNet under the **GNU Affero General Public License v3.0 (AGPL-3.0)** (see <https://github.com/SerNet/verinice-veo>).

This SDK is a separate work: a network client that consumes the public HTTP API. It is licensed under the **Apache License, Version 2.0**. Using this client to call a remotely hosted verinice.veo instance does not, by itself, make your application a derivative of the AGPL-licensed server. If you modify and redistribute the AGPL-licensed server itself, that is a separate matter governed by the AGPL.

## No warranty

This software is provided **“AS IS”**, without warranties or conditions of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement. See `LICENSE` for the full Apache-2.0 terms.

You are solely responsible for verifying that your use of the verinice.veo API complies with:

- your contract or subscription terms with SerNet (or your self-hosted deployment policies);
- applicable data-protection and information-security laws;
- any rate limits, authentication, and acceptable-use rules of the API endpoint you call.

## API compatibility

The verinice.veo API evolves over time. This SDK may lag behind or diverge from a given server version. Always consult the OpenAPI/Swagger documentation for your target instance (for example Swagger UI on your deployment, or the public docs at <https://veo-docs.verinice.com/>).
