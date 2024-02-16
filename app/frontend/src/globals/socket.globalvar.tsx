
import { useState } from 'react';
import io from 'socket.io-client'

export const transcendenceSocket = io('http://localhost:3001/', {autoConnect: false});


let testGlobal: any = "test1";

export const getTestGlobal = () => testGlobal;

export const setTestGlobal = (value: any) => {
  testGlobal = value;
};