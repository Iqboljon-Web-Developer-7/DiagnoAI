"use server"

import axios from "axios";

export async function getToken() {
  const token = await axios.get('/api/get-token') 
  console.log(token, 'token');
  return token;
}
