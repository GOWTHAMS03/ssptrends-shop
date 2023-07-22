/**
 *
 * CategoryShop
 *
 */

 import React from 'react';
 import { connect } from 'react-redux';
 
 import actions from '../../actions';
 
 import ProductList from '../../components/Store/ProductList';
 import NotFound from '../../components/Common/NotFound';
 import LoadingIndicator from '../../components/Common/LoadingIndicator';
 
 class CategoryandSizeShop extends React.PureComponent {
 componentDidMount() {

    const categoryParam = this.props.match.params.category;
    const sizeParam = this.props.match.params.size;
   
    this.props.fetchProductsBySize(categoryParam, sizeParam);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      const slug = this.props.match.params.slug;
       this.props.fetchProductsBySize('category', slug);
    }
  }
 
   render() {
     const { products, isLoading, authenticated, updateWishlist } = this.props;


     return (
       <div className='category-shop'>
         {isLoading && <LoadingIndicator />}
         {products && products.length > 0 && (
           <ProductList
             products={products}
             authenticated={authenticated}
             updateWishlist={updateWishlist}
           />
         )}
         {!isLoading && products && products.length <= 0 && (
           <NotFound message='No products found.' />
         )}
       </div>
     );
   }
 }
 
 const mapStateToProps = state => {

   return {
     products: state.menu.productsBySize.categoryandsize,
     isLoading: state.product.isLoading,
     authenticated: state.authentication.authenticated
   };
 };
 
 export default connect(mapStateToProps, actions)(CategoryandSizeShop);
 