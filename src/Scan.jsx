import './scan.css';
import React from "react";
import { Container, Row, Col, Tabs, Tab, Button, Form } from 'react-bootstrap'
// import { DropdownInput } from 'react-dropdown-input';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusSquare, faPlusSquare, faFilter, faStar, faCircleCheck, faTrash, faC, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
// import { faMinusSquare, faPlusSquare, faFilter, faStar } from '@fortawesome/free-solid-svg-icons'


function Scan(props) {
  const [pdf, setPdf] = useState(null);
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);
  const [pagewords, setpagewords] = useState([]);
  const [loptions, setLoptions] = useState([]);

  const colors = {
    reject: 'red',
    common: 'green',
    filter: 'violet',
    star: 'yellow'
  }
  const sendData = () => {
    ipcRenderer.send('app-ipc', { location });
  };

  const scanData = () => {
    if ( page >0 ) {
      ipcRenderer.send('app-scan', { location, page });
    }
  };
  const setWordType = (index, type) => {
    const _pagewords = [...pagewords];
    _pagewords[index].type = type;
    setpagewords(_pagewords);
  };
  const magicData = () => {
    const _pagewords = [...pagewords];
    const seggWords = {
      common: [],
    }
    _pagewords.forEach((w)=>{
      if(w.type === 'common'){
        seggWords.common.push(w.word);
      }
    })
    console.log(seggWords);
    ipcRenderer.send('add-common', { common: seggWords.common });

  };
  const addCommonAfter = (_evt, _data) => {  
    window.alert('added words to common');
  }
  const appScan = (evt, data) => {
    let { meaningMap } = data;
    console.log(meaningMap)
    setpagewords(meaningMap);
  }
  const lastLocationAfter = (event, ldata) => {
    console.log('insisdde lastLocationAfter ', ldata)
    let { lloptions } = ldata;
    const data = [{ value: lloptions, label: lloptions}];
    setLoptions(data);
    setLocation(data[0].value)
  }
  useEffect(() => {
    ipcRenderer.on('app-scan', appScan);
    ipcRenderer.on('add-common-after', addCommonAfter);
    ipcRenderer.on('last-location-after', lastLocationAfter);
    ipcRenderer.send('last-location', { });
    return () => {
      ipcRenderer.removeListener('app-scan', appScan);
      ipcRenderer.removeListener('add-common-after', addCommonAfter);
      ipcRenderer.removeListener('last-location-after', lastLocationAfter);
    }
  }, [])
  return (
    <Container
    fluid
    >
          <Tabs
          className="mt-2"
            defaultActiveKey="home"
            fill
            justify
          >
            <Tab className="pt-2" eventKey="home" title="Home">
              <Container style={{ paddingLeft: '0px' }}>
                <Row className="pl-3">
                  <Form.Control
                    style={{ borderRadius: 0}} 
                    type="text" 
                    placeholder="enter pdf location"
                    value={location}
                    onChange={(e)=>{setLocation(e.target.value)}}
                  />
                </Row>
                {/*<Row className="pl-3" style={{ border: 'solid 1px red' }}>
                  <Col sm={12} style={{ border: 'solid 1px red' }}>
                    <Select
                      value={} 
                      options={loptions}
                      noOptionsMessage={(i)=>{return null}}
                      onInputChange={(d)=>{
                        console.log('i -> ', d)
                      }}
                    />
                  </Col>
                </Row>*/}
                {/*<Row className="pl-3">
                  <div style={{width: '100%'}}>
                    <Select
                      options={loptions}
                      noOptionsMessage={(i)=>{console.log(i); return null}}
                      onInputChange={(d)=>{
                        console.log('i -> ', d)
                      }}
                      onChange={(e) => {console.log(e)}}
                      placeholder=""
                      />
                  </div>
                <*/}/Row>
                <Row className="pl-3 pt-2">
                  <Button variant="outline-light" className="rounded-0" onClick={sendData}>Get data</Button>
                </Row>
                {
                  props.isBuffer ? (
                  <Row className="pl-0 pt-2">
                    <Col sm={6}>
                      <Row className="pl-3">
                        <Button active={false} variant="outline-light" className="iconbutton rounded-0">
                          <FontAwesomeIcon 
                            style={{color: 'white'}} 
                            icon={faMinusSquare}
                            onClick={() => { setPage(page-1)}} 
                          />
                        </Button>
                        <Form.Control
                          style={{ width: '75px', borderRadius: 0}} 
                          type="number"
                          value={page}
                          onChange={(e)=>{setPage(Number(e.target.value))}}
                        />
                        <Button variant="outline-light" className="iconbutton rounded-0">
                          <FontAwesomeIcon style={{color: 'white'}} icon={faPlusSquare} onClick={() => { setPage(page+1)}}/>
                        </Button>
                      </Row>
                    </Col>
                    <Col sm={3}>
                      <Button variant="outline-light" className="rounded-0" onClick={scanData}>Scan</Button>
                    </Col>
                    <Col sm={3}>
                      {
                        // (pagewords.length) ? (
                        //   <Button variant="outline-light" className="rounded-0" onClick={magicData}>
                        //     <FontAwesomeIcon icon={faWandMagicSparkles} style={{ color: 'lightblue' }}/>
                        //   </Button>
                        // ):null
                      }
                    </Col>
                  </Row>
                  ):null
                }
                {
                  (Object.keys(pagewords).length) ? (
                    <div 
                      className="pl-0 pt-2 mt-3" 
                      style={{ 
                        maxHeight: '750px',
                        overflowY: 'auto',
                      }}
                    >
                      <div className="pb-2 pt-1" style={{ color: 'Green', borderBottom: 'solid 1px green '}}>
                        <b>Vocab</b>
                      </div>
                      <div>
                        <div>
                          {
                            Object.keys(pagewords).map((word) => {
                              return <div className="pl-2 pt-1" style={{ color: 'white', borderBottom: 'solid 1px blue'}}>
                                  <div><b><u><h5>{word}</h5></u></b></div>
                                  <br/>
                                  <div classname="pl-3">
                                    <ul>
                                      {
                                        pagewords[word].map((meaning) => {
                                          return <li>
                                            {
                                              meaning
                                            }
                                          </li>
                                        })
                                      }
                                    </ul>
                                  </div>
                              </div>
                            })
                          }
                        </div>
                        
                      </div>
                    </div>
                  ):null
                }
                
              </Container>
            </Tab>
            <Tab eventKey="profile" title="Profile">
              Tab content for Profile
            </Tab>
            <Tab eventKey="contact" title="Contact">
              Tab content for Contact
            </Tab>
          </Tabs>
      </Container>
 );
}
export default Scan;