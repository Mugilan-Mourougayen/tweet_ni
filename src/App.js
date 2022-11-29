
import lockabi from "./artifacts/contracts/Lock.sol/Lock.json"
import { ethers } from "ethers";
import {useEffect,useState} from "react";
import "./App.css"
import { Button,  TextField } from "@mui/material";
import Swal from "sweetalert2";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Typography from '@mui/material/Typography';

function App() {
 
  const [accounts, setAccounts] = useState();
  const [msg, setMsg] = useState();
  const [name, setName] = useState();
  const [data,setData]=useState()
  







  // const mainaddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const mainaddress = "0x1a65429A8824055A255fFdF440a5Cfc6347dB1cf"
  
  async function connectAccount(){
    if(window.ethereum){
      const account = await window.ethereum.request({
        method: 'eth_requestAccounts'}
      );
      localStorage.setItem("acc", account[0]);
     
      

    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please install the metamask and connect with account!',
        footer: '<a href="https://metamask.io/download/">click the link below to install</a>'
      })
    }
  } 
  
   
  
useEffect(() => {
 connectAccount()
},[])



async function addtweet() {
  if(window.ethereum){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      mainaddress,
      lockabi.abi,
      signer
    );
    try{
      const responce = await contract.addTwitter(msg,name)
      console.log("response",responce)
      setMsg("")
      setName("")
      Swal.fire('Tweet has been added plz update the chat')
  
    }
catch(err){
  console.log("err",err)

}

  }
}



async function edittweet(oldmsg,newmsg,id) {
  if(window.ethereum){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      mainaddress,
      lockabi.abi,
      signer
    );
    try{
      const responce = await contract.replace(oldmsg,newmsg,id)
      console.log("response",responce)
      Swal.fire('Tweet has been updated plz update the chat')
  
    }
catch(err){
  console.log("err",err)

}

  }
}







async function readtweet() {
  setAccounts(localStorage.getItem("acc"))
  console.log(accounts)
  if(window.ethereum){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      mainaddress,
      lockabi.abi,
      signer
    );
    try{
      const responce = await contract.getResult()
      console.table("list of tweet",responce)

      var objs = responce.map(x => ({ 
        msg: x[0], 
        name: x[1],
        address:x[2],
        uniqueid:x[3]

      }));

      setData(objs.reverse())
      
     
    }
catch(err){
  console.log("err",err)

}

  }
  
}

const editfunction=async(msg,id)=>{


  const { value: text } = await Swal.fire({
    input: 'textarea',
    inputLabel: 'Message',
    inputPlaceholder: 'Type your message here...',
    inputValue:msg,
    inputAttributes: {
      'aria-label': 'Type your message here'
    },
    showCancelButton: true
  })
  
  if (text) {
    if(text === msg){
      Swal.fire('No update has done')
  }

else{
  edittweet(msg,text,id)

}
  }



}



async function deletefunction(id,add) {
    let deleteid = (data.length-1) - id 
    if(window.ethereum){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        mainaddress,
        lockabi.abi,
        signer
      );
      try{
        const responce = await contract.remove(deleteid)
        console.log("response",responce)
        Swal.fire('Tweet has been deleted plz update the chat')
      
  
     
       
      }
  catch(err){
    console.log("err",err)
  
  }
  
    }

  
}



return (
<div className="app">
  <div style={{margin:"20px",padding:"50px"}}>

  <span style={{margin:"30px"}}>Message:</span> 
 <TextField  id="outlined-basic"  variant="outlined" size="small" onChange={(e)=>{setMsg(e.target.value)}} />


 <span style={{margin:"30px"}}>Name:</span> 
 <TextField id="outlined-basic"  variant="outlined" size="small" onChange={(e)=>{setName(e.target.value)}} />



  <Button style={{marginLeft:"100px", backgroundColor: "#00974e"}} variant="contained" onClick={addtweet} size="small">add</Button>




  <Button onClick={readtweet} variant="contained"  size="small" style={{ float: "right",backgroundColor:"#00974e"}}>Update</Button>
  </div>

{data&&



  <div>
        { data.map((dat,id) => (
         
       
              
         
       
        
<Card key={id} sx={{ maxWidth: "100%" }}  className={id===0?"first":"last"} style={{background:'#dad9d9',marginBottom:"10px"}}>
    {console.log(id)}
      <CardContent className={accounts.toLowerCase()===dat.address.toLowerCase()?"self":"others"} style={{padding:"10px 0px 0px 30px"}}>
        <Typography  variant="h5" style={{margin:0}}>
          {dat.name.toUpperCase()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         {dat.msg}
        </Typography>
      </CardContent>
      <CardActions style={{background:"#b1afaf"}}>
              <Button size="small" variant="contained" disabled={accounts.toLowerCase()===dat.address.toLowerCase()?false:true}  onClick={() => editfunction(dat.msg,dat.uniqueid)}>
              edit
            </Button>
      <Button size="small" color="error" variant="contained" disabled={accounts.toLowerCase()===dat.address.toLowerCase()?false:true}  onClick={() => deletefunction(id)}>
                delete
              </Button>
      </CardActions>
    </Card>
  












        
        )) }
  </div>


}

</div>
)
}

export default App;