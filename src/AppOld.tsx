import {useState} from "react";

export const App = () => {
  const [response, setResponse] = useState([])
  const handleSend = async () => {
    try {
      const json = await fetch('https://dev.liveasset.ru/v1/version')
      const data = await json.json()
      setResponse(data)
    } catch (e) {
      console.log('ERRR', e)
    }
  }

  return (
    <div className="read-the-docs">
      Hello! DEV
      <hr/>
      <button onClick={handleSend}>SEND</button>
      <pre>
        <code>{JSON.stringify(response, this, 4)}</code>
      </pre>
    </div>
  );
}

