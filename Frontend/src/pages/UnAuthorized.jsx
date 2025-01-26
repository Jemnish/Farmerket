import React from 'react'
import { Container,Row, Col ,Button } from 'reactstrap'
import { Link } from 'react-router-dom'
const UnAuthorized = () => {
  return (
    <section>
        <Container>
            <Row>
                <Col lg='12' className='pt-5 text-center'>
                <div className="no__thankyou">
                    <span>
                    <i class="ri-close-line"></i></span>
                    <h1 className="mb-3 fw-semibold">Sorry!!!</h1>
                    <h3 className='mb-4'> You aren't authorized to view this page.</h3>

                    <Button className='btn primary__btn w-25'>
                        <Link to='/login'> Back to Login</Link>
                    </Button>
                    
                </div>

                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default UnAuthorized