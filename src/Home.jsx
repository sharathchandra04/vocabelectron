import React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { PDFDocument } from "pdf-lib";
import { ipcRenderer } from 'electron';
import Scan from './Scan';
function Home() {
  const [pdf, setPdf] = useState(null);
  const [buffer, setBuffer] = useState(null);
  
  const pdfBlob = (evt, buffer) => {
    setBuffer(buffer.buffer);
    const blob = new Blob([buffer.buffer], {type: 'application/pdf'});
    const blobURL = URL.createObjectURL(blob);
    setPdf(blobURL);
  }
  useEffect(() => {
    ipcRenderer.on('pdf-blob', pdfBlob);
    return () => {
      ipcRenderer.removeListener('pdf-blob', pdfBlob);
    }
  }, [])

  return (
      <Container 
        fluid 
        style={{
          // backgroundColor: 'black'
        }}
      >
        <Row style={{ height: '960px'}}>
          <Col sm={9} style={{ height: '100%'}}>
            {
              pdf != null ? <iframe
              src={pdf}
              type="application/pdf" 
              width="100%"
              height="100%"
              style={{overflow: 'auto', width: '100%', height: '100%',}}
            >
            </iframe>: null
            }
          </Col>
          <Col sm={3}>
            {/* <button onClick={sendData}>Get data</button>
            <button onClick={extractPdfPage}>extractPdfPage</button> */}
            <Scan isBuffer={ pdf != null ? true : false }/>
          </Col>
        </Row>
      </Container>
 );
}
export default Home;