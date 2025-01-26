import React from 'react'
import { Container,Row, Col ,Button } from 'reactstrap'
import { Link } from 'react-router-dom'
const NoThankyou = () => {
  return (
    <section>
        <Container>
            <Row>
                <Col lg='12' className='pt-5 text-center'>
                <div className="no__thankyou">
                    <span>
                    <i class="ri-close-line"></i></span>
                    <h1 className="mb-3 fw-semibold">Sorry!!!</h1>
                    <h3 className='mb-4'> Payment Failed</h3>

                    <Button className='btn primary__btn w-25'>
                        <Link to='/home'> Back to home</Link>
                    </Button>
                    
                </div>

                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default NoThankyou