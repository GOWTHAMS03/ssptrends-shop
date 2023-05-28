import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import NotFound from '../../components/Common/NotFound';
import actions from '../../actions';
import banners from './banners.json';
import CarouselSlider from '../../components/Common/CarouselSlider';
import { responsiveOneItemCarousel } from '../../components/Common/CarouselSlider/utils';
import ProductList from '../../components/Store/ProductList';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class Homepage extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.filterProducts(slug);
  }

  handleSizeClick = (slug) => {
    this.props.history.push(`/shop/size/${slug}`);
    // Call your API or perform any additional actions here
  };

  render() {
    const { storesizes, storeProducts, isLoading, authenticated, updateWishlist } = this.props;

    const displayProducts = storeProducts && storeProducts.length > 0;
    const sizeArray = storeProducts.map((product) => product.size);
    const sizeArrayLength = sizeArray.length;
    // Get the newest products and limit to five
    const newestProducts = storeProducts && storeProducts.slice(0, 4);

    return (
      <div className='homepage'>
        <Row className='flex-row'>
          <Col>
            <div className='home-carousel'>
              <CarouselSlider
                swipeable={true}
                showDots={true}
                infinite={true}
                autoPlay={true}
                slides={banners}
                responsive={responsiveOneItemCarousel}
              >
                {banners.map((item, index) => (
                  <img key={index} src={item.imageUrl} alt={`Banner ${index}`} />
                ))}
              </CarouselSlider>
            </div>
          </Col>
        </Row>
        <div className='parent-container'>
        
          <div>
            <h1>Sizes</h1>
          
          </div>
          <div className='mini-size-block round-2'>
            {storesizes.map((size, index) => {
              // Find products matching the current size
              const sizeProducts = storeProducts.filter((product) => product.size._id === size._id);
              const sizeProductsLength = sizeProducts.length; // Get the length of sizeProducts

              return (
                <div
                  key={index}
                  className='size-item'
                  onClick={() => this.handleSizeClick(size.slug)}
                >
                  <h2 className='size-text'>{size.name}</h2>
                  <hr/>
                  <p>{sizeProductsLength}</p> {/* Display the length of sizeProducts */}
                </div>
              );
            })}
          </div>
        </div>

        <div>
        <p className='parent-container'> Total Product Count <h1>{sizeArrayLength}</h1></p> 
          <h1 className='parent-container'>Latest Products</h1>
        </div>
        <div className='products-shop '>
          {isLoading && <LoadingIndicator />}
          {displayProducts && (
            <ProductList
              products={newestProducts}
              authenticated={authenticated}
              updateWishlist={updateWishlist}
            />
          )}
          {!isLoading && !displayProducts && <NotFound message='No products found.' />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    storesizes: state.size.storesizes,
    storeProducts: state.product.storeProducts,
    isLoading: state.product.isLoading,
    authenticated: state.authentication.authenticated,
  };
};

export default connect(mapStateToProps, actions)(Homepage);
