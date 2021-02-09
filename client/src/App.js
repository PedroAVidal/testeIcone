import React, { useState, useEffect } from "react";
import './App.css';
import Axios from 'axios';

function App() {

  const [loginReg, setLoginReg] = useState("");
  const [passReg, setPassReg] = useState("");

  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");

  const [loginStatus, setLoginStatus] = useState();

  const [userToken, setUserToken] = useState(null);
  const [list, setList] = useState([]);

  const submitReg = () => {
    console.log("Register!");
    Axios.post("http://localhost:3001/createaccount", {
      loginReg: loginReg,
      passReg: passReg,
    }).then((response) => {
      console.log(response.data)
    });
    setLoginReg('');
    setPassReg('');
  };

  const submitLog = () => {
    console.log("Login!", login, pass);
    Axios.post("http://localhost:3001/login", {
      login: login,
      pass: pass,
    }).then((response) => {
      if (response.status == 200) {
        if (response.data.message == "Login efetuado com sucesso!") {
          setLoginStatus(response.data.message)
          window.sessionStorage.setItem("token", response.data.token)
          setUserToken(response.data.token)
          buscaLista()
        } else {
          setLoginStatus(response.data.message)
        };
      };
    });
  };

  const submitLogout = () => {
    setLoginStatus("")
    window.sessionStorage.removeItem("token")
    setUserToken(null)
  }

  const buscaLista = () =>{
    Axios.get("http://localhost:3001/retornaclientes").then((response)=>{
      if(response.status==200){
        setList(response.data)
        console.log(response.data)
      }
    });
  };

  return (
    <div className="App">
      {
        userToken !== null ? (
          <React.Fragment>
            <h1>{loginStatus}</h1>
            <div>{list.map(item=>JSON.stringify(item))}</div>
            <button onClick={submitLogout}>Logout</button>
          </React.Fragment>
        ) : (
            <React.Fragment>
              <div className="Cadastro">
                <h1>Cadastro</h1>
                <p><label>Usuário: </label>
                  <input type="text" name="loginreg" value={loginReg} onChange={(e) => {
                    setLoginReg(e.target.value);
                  }} /></p>
                <p><label>Senha: </label>
                  <input type="text" name="passreg" value={passReg} onChange={(e) => {
                    setPassReg(e.target.value);
                  }} /></p>
                <button onClick={submitReg}>Register</button>
              </div>
              <div className="Entrar">
                <h1>Entrar</h1>
                <label>Usuário: </label>
                <input type="text" name="login" value={login} onChange={(e) => {
                  setLogin(e.target.value);
                }} />
                <label> Senha: </label>
                <input type="text" name="pass" value={pass} onChange={(e) => {
                  setPass(e.target.value);
                }} />
                <p><button onClick={submitLog}>Login</button></p>
              </div>
              <h1>{loginStatus}</h1>
            </React.Fragment>
          )
      }
    </div>
  );
}

export default App;