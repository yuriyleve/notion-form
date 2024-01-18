const axios = require("axios");
const Form = require("../models/mForm");
const { v4: uuidv4 } = require("uuid");
const convertFormToNotion = require("../utils/convertFormToNotion");
const clientId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_CLIENT_SECRET;
const redirectUri = process.env.AUTH_REDIRECT_URI;
const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
const { Client } = require("@notionhq/client");
let access_token = null;

const getAccessToken = async (code) => {
  const resp = await axios.post(
    "https://api.notion.com/v1/oauth/token",
    {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
    }
  );

  return resp.data.access_token;
};

const getTables = async (req, res, next) => {
  try {
    const code = req.body.code;
    access_token = await getAccessToken(code);

    const { data } = await axios({
      method: "POST",
      url: "https://api.notion.com/v1/search",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "Notion-Version": "2022-06-28",
      },
      data: { filter: { property: "object", value: "database" } },
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getDatabase = async (req, res, next) => {
  try {
    const { data } = await axios({
      method: "POST",
      url: "https://api.notion.com/v1/search",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "Notion-Version": "2022-06-28",
      },
      data: { filter: { property: "object", value: "database" } },
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const save = async (req, res, next) => {
  try {
    const message = "submitted";
    const notion = new Client({ auth: access_token });
    const { table, formData } = req.body;
    const properties = convertFormToNotion(formData);

    await notion.pages.create({
      parent: {
        database_id: table.value,
      },
      properties: properties,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

const publish = async (req, res, next) => {
  try {
    const uniqueId = uuidv4();
    const message = "published";

    await Form.create({
      key: uniqueId,
      ...req.body,
    });

    setTimeout(() => {
      res.status(201).json({
        success: true,
        uniqueId,
        message,
      });
    }, 3000);
  } catch (error) {
    next(error);
  }
};

const getForm = async (req, res, next) => {
  try {
    const { formId } = req.body;

    const data = await Form.find({ key: formId });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTables,
  getDatabase,
  getForm,
  publish,
  save,
};
