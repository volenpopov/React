import React from 'react';
import './warning.css';
// import {Article, ArticleWithWarning} from './Components/Article';
// import {Register, RegisterWithWarning} from './Components/Register';
// import {Navigation, NavigationWithWarning} from './Components/Navigation';
import {InputForm, InputFormWithError} from './Components/InputForm'; 

function App() {
  return (
    <div className="App">
      {/* <Article/>
      <ArticleWithWarning/>
      <Register/>
      <RegisterWithWarning/>
      <Navigation/>
      <NavigationWithWarning/> */}
      <InputForm/>
      <InputFormWithError/>
    </div>
  );
}

export default App;
