export const validateConvoyForm = (formValues: any, authMethod: string) => {
  let errors: any = {};
  let isValid = true;

  if (!formValues.convoyUrl) {
    errors.convoyUrl = "Convoy URL is required";
    isValid = false;
  }
  if (!formValues.webhookUrl) {
    errors.webhookUrl = "Webhook URL is required";
    isValid = false;
  }
  if (!formValues.rateLimitDuration) {
    errors.rateLimitDuration = "Rate Limit Duration is required";
    isValid = false;
  } else if (isNaN(formValues.rateLimitDuration)) {
    errors.rateLimitDuration = "Rate Limit Duration must be a number";
    isValid = false;
  }
  if (!formValues.ownerId) {
    errors.ownerId = "Owner ID is required";
    isValid = false;
  }
  if (!formValues.supportEmail) {
    errors.supportEmail = "Support Email is required";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(formValues.supportEmail)) {
    errors.supportEmail = "Support Email is invalid";
    isValid = false;
  }
  if (!formValues.name) {
    errors.name = "Name is required";
    isValid = false;
  }
  if (!formValues.projectId) {
    errors.projectId = "Project ID is required";
    isValid = false;
  }
  if (!formValues.apiKey) {
    errors.apiKey = "API Key is required";
    isValid = false;
  }
  if (!formValues.rateLimit) {
    errors.rateLimit = "Rate Limit is required";
    isValid = false;
  } else if (isNaN(formValues.rateLimit)) {
    errors.rateLimit = "Rate Limit must be a number";
    isValid = false;
  }

  if (!authMethod) {
    errors.authMethod = "Authentication method is required";
    isValid = false;
  } else if (authMethod === "BasicAuth") {
    if (!formValues.secret) {
      errors.secret = "Username and Password are required for Basic Auth";
      isValid = false;
    }
  } else if (authMethod === "Bearer") {
    if (!formValues.secret) {
      errors.secret = "Token is required for Bearer Auth";
      isValid = false;
    }
  }

  return { isValid, errors };
};

export const validateMapperForm = (mapperValues: any) => {
  let errors: any = {};
  let isValid = true;

  if (!mapperValues.projectId) {
    errors.mapperProjectId = "Convoy Project ID is required";
    isValid = false;
  }
  if (!mapperValues.apiKey) {
    errors.mapperApiKey = "Convoy API Key is required";
    isValid = false;
  }
  if (!mapperValues.endpointId) {
    errors.mapperEndpointId = "Convoy Endpoint ID is required";
    isValid = false;
  }
  if (!mapperValues.accountId) {
    errors.mapperAccountId = "Account ID is required";
    isValid = false;
  }
  if (!mapperValues.collectionName) {
    errors.mapperCollectionName = "Collection Name is required";
    isValid = false;
  }
  if (!mapperValues.wrapper) {
    errors.mapperWrapper = "Wrapper is required";
    isValid = false;
  }
  if (!mapperValues.pushData) {
    errors.mapperPushData = "Push Data is required";
    isValid = false;
  }

  return { isValid, errors };
};
