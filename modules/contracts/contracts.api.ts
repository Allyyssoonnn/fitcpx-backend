import { Injectable } from "@nestjs/common";
import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";
const dev = process.env.NODE_ENV != "production";
const urlBase = "https://api.autentique.com.br/v2/graphql";
const tokenAPI = process.env.AUTENTIQUE_KEY;

@Injectable()
export class ContractsAPI {
   token: string;
   coreURL: string;
   constructor() {
      this.token = tokenAPI;
      this.coreURL = urlBase;
   }

   async createContract(contractPDF: any, email: string, name = "Contrato") {
      function bufferToStream(buffer: any) {
         const stream = new Readable();
         stream.push(buffer);
         stream.push(null);
         return stream;
      }

      let data = new FormData();
      data.append(
         "operations",
         `{"query":"mutation CreateDocumentMutation($document: DocumentInput!,$signers: [SignerInput!]!,$file: Upload!) {createDocument(sandbox: ${
            dev ? "true" : "false"
         },document: $document,signers: $signers,file: $file) {id name refusable sortable created_at signatures { public_id name email created_at action { name } link { short_link } user { id name email }}}}","variables":{"document": {"name": "${name}"},"signers": [{"email": "${email}","action": "SIGN"}],"file":null}}`,
      );
      data.append("map", '{"file": ["variables.file"]}');
      data.append("file", bufferToStream(contractPDF), {
         filename: `${name}.pdf`,
         contentType: "application/pdf",
         // knownLength: contratoPdfObject.length,
      });

      let config = {
         method: "post",
         maxBodyLength: Infinity,
         url: urlBase,
         headers: { Authorization: `Bearer ${this.token}`, ...data.getHeaders() },
         data: data,
      };

      const resp = await axios.request(config);

      if (resp) {
         console.log(JSON.stringify(resp.data));
         return resp.data.data.createDocument.id;
      }
   }

   async deleteContract(contractId: string) {
      let data = JSON.stringify({
         query: `mutation { deleteDocument(id: "${contractId}") }`,
         variables: {},
      });

      let config = {
         method: "post",
         maxBodyLength: Infinity,
         url: urlBase,
         headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
         },
         data: data,
      };

      await axios
         .request(config)
         .then((response) => {
            console.log(JSON.stringify(response.data));
         })
         .catch((error) => {
            console.log(error);
         });
   }

   async downloadContract(documentId: string, signed: boolean) {
      let data = JSON.stringify({
         query: `query { document(id: "${documentId}") { id name refusable sortable created_at files { original signed } signatures { public_id name email created_at action { name } link { short_link } user { id name email } email_events { sent opened delivered refused reason } viewed { ...event } signed { ...event } rejected { ...event } } } } fragment event on Event { ip port reason created_at geolocation { country countryISO state stateISO city zipcode latitude longitude } }`,
         variables: {},
      });

      let config = {
         method: "post",
         maxBodyLength: Infinity,
         url: "https://api.autentique.com.br/v2/graphql",
         headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
         },
         data: data,
      };

      const resp = await axios.request(config);

      const document = resp?.data?.data?.document;
      if (document?.files?.signed && signed) {
         return document?.files?.signed;
      } else if (document?.files?.original) {
         return document?.files?.original;
      } else {
         return null;
      }
   }
}
