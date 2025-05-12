const { createClient } = require("@supabase/supabase-js");
const env = require("dotenv");
require("express");
env.config();
const url = process.env.URL
console.log(`URL: ${url}`)