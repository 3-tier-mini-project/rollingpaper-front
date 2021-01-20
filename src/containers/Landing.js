/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// nodejs library that concatenates classes
import classnames from "classnames";
import { useInputs } from "../lib/hooks";

// reactstrap components
import {
  Spinner,
  Container,
  Row,
  Col
} from "reactstrap";

import { getBoardList, goToBoardInsert, boardTest, deleteBoard, insertBoard } from '../modules/boardReducer';

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import CardsFooter from "components/Footers/CardsFooter.js";

// index page sections
import Download from "components/IndexSections/Download.js";
import BoardList from '../components/BoardList';
import Input from 'reactstrap/lib/Input';
import FormGroup from 'reactstrap/lib/FormGroup';
import Button from 'reactstrap/lib/Button';

function Landing() {
  const { boards, result } = useSelector(state => state.boardReducer);

  const [ {boardTitle, boardCn}, onChange, reset] = useInputs({
    boardTitle: "",
    boardCn: ""
});

  const dispatch = useDispatch();
  const mainRef = useRef(0);
  useEffect(() => {
    dispatch(getBoardList());
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainRef.current.scrollIntoView();
  }, [result]);

  const onSubmit = useCallback(() => {
    if (boardTitle == "" || boardCn == "") {
      alert("실패");  
      return;
    }
    dispatch(insertBoard({boardTitle, boardCn}));
    alert("등록완료");
    reset();
}, [{boardTitle, boardCn}]);

  const onDelete = useCallback((boardSeq) => {
    dispatch(deleteBoard(boardSeq));
  }, []);

  return (
    <>
      <main ref={mainRef}>
        <div className="position-relative">
          {/* shape Hero */}
          <section className="section section-lg section-shaped pb-250">
            <div className="shape shape-style-1 shape-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="py-lg-md d-flex">
              <div className="col px-0">
                <Row>
                  <Col lg="6">
                    <h1 className="display-3 text-white">
                      Board
                        <span>insert board</span>
                    </h1>
                    <FormGroup>
                      <Input type="text" placeholder="Title" style={{ marginBottom: '10px' }} name="boardTitle" value={boardTitle} onChange={onChange} />
                      <Input type="textarea" placeholder="Content ..." rows="3" name="boardCn" value={boardCn} onChange={onChange} style={{ marginBottom: '10px' }} />
                      <Button type="button" color="secondary" size="m" onClick={onSubmit}>submit</Button>
                    </FormGroup>
                    {/* 
                      <p className="lead text-white">
                        The design system comes with four pre-built pages to
                        help you get started faster. You can change the text and
                        images and you're good to go.
                      </p>
                      <div className="btn-wrapper">
                        <Button
                          className="btn-icon mb-3 mb-sm-0"
                          color="info"
                          href="https://demos.creative-tim.com/argon-design-system-react/#/documentation/alerts?ref=adsr-landing-page"
                        >
                          <span className="btn-inner--icon mr-1">
                            <i className="fa fa-code" />
                          </span>
                          <span className="btn-inner--text">Components</span>
                        </Button>
                        <Button
                          className="btn-white btn-icon mb-3 mb-sm-0 ml-1"
                          color="default"
                          href="https://www.creative-tim.com/product/argon-design-system-react?ref=adsr-landing-page"
                        >
                          <span className="btn-inner--icon mr-1">
                            <i className="ni ni-cloud-download-95" />
                          </span>
                          <span className="btn-inner--text">
                            Download React
                          </span>
                        </Button>
                      </div> */}
                  </Col>
                </Row>
              </div>
            </Container>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          {/* 1st Hero Variation */}
        </div>
        {
          (boards.loading || boards.error || !boards.data ?
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-80px' }}>
              <Spinner type="grow" color="light" style={{ width: '8rem', height: '8rem' }} />
            </div> :
            <section className="section section-lg pt-lg-0 mt--200">
              <Container>
                <Row className="justify-content-center">
                  <Col lg="12">
                    <Row className="row-grid">
                      <BoardList boards={boards.data} deleteBoard={onDelete} />
                    </Row>
                  </Col>
                </Row>
              </Container>
            </section>
          )
        }
      </main>
    </>
  );
}

export default Landing;
