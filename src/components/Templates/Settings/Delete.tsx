import React, {useState} from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Button, Card, Container, Image } from "react-bootstrap";
<<<<<<< HEAD
import styles from "../../../styles/delete.module.scss";
=======
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from "../../../styles/delete.module.scss"
>>>>>>> 5010075cfd562cc9c994918816425dd87b2480cc

const Delete =  () => {
  const [progress, setProgress] = useState(false)
  const router = useRouter()

  const handleDelete = async ()=>{
    const comfirm = window.confirm('Continue wuth this action')
    if(!comfirm) return
    setProgress(true)
    try{
      const response = await axios.delete(`/api/user`, {headers:{
        authorization:`Bearer ${localStorage.getItem('accessToken')}`
      }})
      setProgress(false)
      console.log(response.data);

      setTimeout(()=>{
        toast.success('Account deleted successfully',{
          position: toast.POSITION.TOP_RIGHT,
          autoClose:7000,
          toastId:'toast1'
        })
        router.push('/login')
        localStorage.removeItem('accessToken')
      },3000)
      
    }catch(error){
      console.log(error?.response.data);
      setProgress(false)
      toast.error('Failed to delete account',{
        position: toast.POSITION.TOP_RIGHT,
        autoClose:7000,
        toastId:'toast1'
      })
    }
  }
  return (
    <>
<<<<<<< HEAD
      <Container className={styles.container}>
        <Card className={styles.card}>
=======
      <ToastContainer/>
      <Container className = {styles.container}>
        <Card className= {styles.card}>
>>>>>>> 5010075cfd562cc9c994918816425dd87b2480cc
          <Card.Body>
            <Card.Title className={styles.title}>Confirmation</Card.Title>
            <Image
              src="./assets/Warning.png"
              alt="warning"
              className={styles.img}
            />
            <Card.Text className={styles.text}>
              Deleting your account will delete all of the content you have
              created. It will be completely irrecoverable
            </Card.Text>

            <div>
<<<<<<< HEAD
              <Button className={styles.btn1}>Cancel</Button>
              <Button className={styles.btn2}>
                <Image
                  src="./assets/Delete.png"
                  alt="delete"
                  className={styles.img2}
                />{" "}
                Confirm
=======
              <Button className= {styles.btn1}>
                Cancel
              </Button>
              <Button onClick={()=>handleDelete()} className= {styles.btn2}>
                <Image src = './assets/Delete.png' alt = 'delete' className = {styles.img2}/>  {progress?'deleting...':'Confirm'}
>>>>>>> 5010075cfd562cc9c994918816425dd87b2480cc
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Delete;
