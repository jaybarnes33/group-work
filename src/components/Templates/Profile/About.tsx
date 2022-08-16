/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container, Card, FormControl, Form, Button} from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import axios from "axios";
import config from "@/config";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "react-spinner-material";
import {
  BsPlusCircle,
  BsFillCalendarEventFill,
  BsFillPersonFill,
} from "react-icons/bs";
import { MdCall } from "react-icons/md";
import { useSelector } from "@/redux/store";
import { selectUser } from "@/reduxFeatures/authState/authStateSlice";
import styles from "@/styles/profile.module.scss";
import "react-toastify/dist/ReactToastify.css";

const About = () => {
  const user = useSelector(selectUser);
  const router = useRouter();

  const formStyle = {
    marginLeft:'20px',
    marginRight:'20px'
  }
  const rowStyle={
      paddingBottom:'30px', 
      paddingLeft:'20px', 
      paddingRight:'20px'
  }
  const [progress, setProgress] = useState(false)
  const [activeTab, setActiveTab] = useState("bio");
  const [interests, setInterests] = useState([
    "Studying abroad",
    "Internship abroad",
    "Postgraduate study abroad",
    "Housing in Ghana",
  ]);

  useEffect(() => {
    tabVisibility("bio");
  }, []);

  const tabVisibility = (pageTab) => {
    document.getElementById(pageTab).classList.add("text-primary");
    for (const key in Components) {
      if (key !== pageTab) {
        document.getElementById(key).classList.remove("text-primary");
      }
    }
  };

  const tabNav = (tab) => {
    tabVisibility(tab);
    setActiveTab(tab);
  };

  const [editMode, setEditMode]= useState({
    bio:false,
    interests:false,
    gender:false,
    dob:false,
    fullAddress:false,
    websites:false,
    mobileNumber:false
  })

  const [formValues, setFormValues]= useState({
    bio:user?.bio,
    interests:user?.interests,
    gender:user?.gender,
    dob:user?.dob,
    fullAddress:user?.fullAddress,
    websites:user?.websites,
    mobileNumber:user.mobileNumber
  })

  const handleEdit= (item)=>{
    const edit_c = {...editMode}
    if(item=="bio"){
      edit_c['interests'] = !edit_c['interests']
    }
    edit_c[item] = !edit_c[item]
    setEditMode(edit_c)
  }

  const handleChange = (e)=>{
    const formValues_c = {...formValues}
    formValues_c[e.currentTarget.name] = e.currentTarget.value
    setFormValues(formValues_c)
    
    
  }

  const checkEditMode = ()=>{
    if( editMode.fullAddress || editMode.mobileNumber ||  editMode.websites || editMode.gender || editMode.dob || editMode.bio || editMode.interests){
      return true
    }else{
      return false
    }
  }

  const handleSubmit = async ()=>{
    
    setProgress(true)
    console.log(formValues);
    
    try{
      const {data} = await axios.put(`${config.serverUrl}/api/users/${user._id}`, formValues)
      setProgress(false)
      console.log(data);
      setFormValues({
        bio:data.user?.bio,
        interests:data.user?.interests,
        gender:data.user?.gender,
        dob:data.user?.dob,
        fullAddress:data.user?.fullAddress,
        websites:data.user?.websites,
        mobileNumber:data.user.mobileNumber
      })
      toast.success('Update successful', {
        position: toast.POSITION.TOP_RIGHT,
        toastId: "1",
      });
      
    }catch(error){
      console.log(error.response?.data)
      setProgress(false)
      toast.error('Update failed', {
        position: toast.POSITION.TOP_RIGHT,
        toastId: "2",
      });
    }
   
  }
  

  const Components = {
    // ............................. Bio Tab .............................
    bio: (
      <Container>
        <div className="row">
          <h5 className="col-10">Bio</h5>
          <h5 className="col-2 btn" style={{ marginTop: "-.5rem" }}>
            {router.query.id ? "" : <FiEdit size="15" onClick={()=>handleEdit('bio')} />}
          </h5>
        </div>
        <div className="row">
          <p className="col-12 text-muted" id="bioText"></p>
          {!editMode.bio ? (
            <p className="text-muted ms-4" style={{ marginTop: "-.8rem" }}>
              {formValues.bio ||  `I am ${user.firstName} ${user.lastName}...` }
           </p>
          ) : (
            <FormControl
              style={{...formStyle, width:'90%'}} 
              //defaultValue={'user.bio'}
              as="textarea"
              rows={2}
              name="bio"
              onChange={(e)=>handleChange(e)}
              value={formValues.bio}
            />
          )}
        </div>
        <div className="row col-12 mt-4">
          <h5>Interest</h5> 
          <div>
            {editMode.interests? 
            <FormControl 
              name="interests"
              style={formStyle} 
              placeholder="Seperate items with comma"
              onChange={(e)=>handleChange(e)}
              //defaultValue={user.interests?.join(',')}
              value={formValues.interests}
            />
                :
            <ul className="text-muted">
              {formValues.interests?.split(',').map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>}
          </div>
        </div>
        {editMode.bio || editMode.interests ? <Button onClick={()=>tabNav('basicInfo')} style={{marginTop:'20px'}} variant="primary" >Continue</Button>:''}
      </Container>
    ),

    // ............................. >Basic info Tab .............................
    basicInfo: (
      <Container>
        <div className="row mb-2">
          <h5 className="col-12">Personal info</h5>
        </div>
        <div className="row" style={rowStyle}>
          <h6 className="col-10" style={{ marginLeft: "-.5rem" }}>
            <BsFillPersonFill size="19" /> <span> Select Gender</span>
          </h6>
          <h5 className="col-2 btn" style={{ marginTop: "-.5rem" }}>
           {router.query.id?"": <FiEdit size="15" onClick={()=>handleEdit('gender')} />}
          </h5>
          {editMode.gender ? 
            <Form.Select  value={formValues.gender}  name="gender" onChange={(e)=>handleChange(e)} >
              <option value=""></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
            :
          <p className="text-muted ms-4" style={{ marginTop: "-.8rem" }}>
            {formValues?.gender || 'none'}
          </p>}
        </div>

        <div className="row" style={rowStyle}>
          <h6 className="col-10" style={{ marginLeft: "-.5rem" }}>
            <BsFillCalendarEventFill size="17" /> <span> Select DOB</span>
          </h6>
          <h5 className="col-2 btn" style={{ marginTop: "-.5rem" }}>
           {router.query.id?"": <FiEdit size="15" onClick={()=>handleEdit('dob')} />}{" "}
          </h5>
          {editMode.dob?
            <Form.Control value={formValues.dob} type="date" onChange={(e)=>handleChange(e)} name="dob" />
            :
          <p className="text-muted ms-4" style={{ marginTop: "-.8rem" }}>
            {formValues.dob || 'none'}
          </p>}
        </div>

        <div className="row mt-4 mb-2">
          <h5 className="col-12">Contact info</h5>
        </div>

        <div className="row" style={rowStyle}>
          <h6 className="col-10 mb-4 fw-light" style={{ marginTop: "-1rem" }}>
            <span className="btn text-primary">
              {!router.query.id && 
              <>
              <BsPlusCircle size="14" onClick={()=>handleEdit('fullAddress')} />
              <span className=" fw-normal fst-italic"> Add Full Address</span>
              </>
              }
              {editMode.fullAddress?
              <Form.Control value={formValues.fullAddress} name="fullAddress" onChange={(e)=>handleChange(e)} />
              :
              <div className="text-muted" >{formValues.fullAddress|| 'none'}</div>}
            </span>
          </h6>

          <h6 className="col-10" style={{ marginLeft: "-.5rem" }}>
            <MdCall size="19" /> <span>Input Mobile No.</span>
          </h6>
          <h5 className="col-2 btn" style={{ marginTop: "-.5rem" }}>
            {!router.query.id &&  <FiEdit size="15" onClick={()=>handleEdit('mobileNumber')} />}
          </h5>
          {editMode.mobileNumber?
          <Form.Control value={formValues.mobileNumber} name="mobileNumber" onChange={(e)=>handleChange(e)} />
          :
          <p className="text-muted ms-4" style={{ marginTop: "-.8rem" }}>
            {formValues.mobileNumber || 'none'}
          </p>
          }
        </div>

        {/* Add Websites */}
        <div className="row mt-4 mb-2">
          <h5 className="col-12">Websites</h5>
        </div>

        <div className="row" style={formStyle}>
          <h6 className="fw-light" style={{ marginTop: "-1rem" }}>
            <span className="btn text-primary">
              {!router.query.id && 
              <>
              <BsPlusCircle size="14" onClick={()=>handleEdit('websites')} />
              <span className="fw-normal fst-italic"> Add social media address</span>
              </>
              }
              
            </span>
          </h6>
          {editMode.websites?
              <FormControl value={formValues.websites}  placeholder="sepearte addresses with comma" name="websites" onChange={(e)=>handleChange(e)}  />
              :
              <ul style={{listStyle:'none'}}>
                {formValues?.websites?.split(',').map((item, i)=>
                  <li>
                    <a target={"_blank"} rel={"noreferrer"} href={item}>{item}</a>
                  </li>
                )}
              </ul>
          }
          
          
        </div>
        {
           checkEditMode()
            ? <Button className="d-flex mx-auto" variant="primary" onClick={()=>handleSubmit()} style={{marginTop:'20px'}}>
                 {progress? <Spinner radius={22} color={"lightgray"} stroke={2} visible={true} />:'Update profile'}
            </Button>:''
            
          }
      </Container>
    ),

    
  };

  return (
    <section className={styles.profileWrap}>
      <ToastContainer/>
      <Container className="shadow-sm">
        <Card className="border-0">
          <div className="row g-2" style={{ marginTop: "-2rem" }}>
            <div className="col-md-12 col-lg-3">
              <Card.Body className="bg-light shadow" style={{ height: "100%" }}>
                <nav className="text-secondary d-flex d-lg-block">
                  <a
                    className="nav-link active btn text-start text-secondary"
                    aria-current="page"
                    id="bio"
                    onClick={()=>tabNav('bio')}
                  >
                    Bio
                  </a>
                  <a
                    className="nav-link btn text-start text-secondary"
                    id="basicInfo"
                    onClick={()=>tabNav('basicInfo')}
                  >
                    Basic Info
                  </a>
                  {/* <a
                    className="nav-link btn text-start text-secondary"
                    id="educationHistory"
                    onClick={tabNav}
                  >
                    Education history
                  </a> */}
                </nav>
              </Card.Body>
            </div>
            <div className="col-md-12 col-lg-9">
              <Card.Body
                id="profileMainSide"
                className="bg-light shadow"
                style={{ height: "100%" }}
              >
                {Components[activeTab]}
              </Card.Body>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
};

export default About;
