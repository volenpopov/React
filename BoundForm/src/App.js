import React from 'react';
import BoundForm from './BoundForm';

function onSubmit(data) {
  console.log(data);
}

function App() {
  return (
    <div className="App">
      <BoundForm onSubmit={onSubmit}>
        Username:
        <input name='username' type='text'/>
        <br/>
        Password:
        <input name='password' type='password'/>  
        <br/>      
        <input type='Submit' value='Login'/> 
      </BoundForm>
    </div>
  );
}

export default App;
