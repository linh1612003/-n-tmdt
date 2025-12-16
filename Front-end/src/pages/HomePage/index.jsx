import React from 'react'
import PropTypes from 'prop-types'
import '../HomePage/style.scss';
import newImageProduct from '../../assets/images/Home.png';



function HomePage(props) {
  return (
    <div style={{
    }}
      className='wrapper'
    >
      <section className="wrapper__home">
        <div className='wrapper__home__content'>
          <h1>Trang Sức Cao Cấp</h1>
          <h3>Tôn Vinh Vẻ Đẹp & Đẳng Cấp</h3>
          <h3>Khám phá bộ sưu tập trang sức sang trọng, tinh xảo</h3>
          <p>
            - Chất liệu đa dạng: Vàng, bạc, kim cương, đá quý<br />
            - Thiết kế hiện đại, đẳng cấp và phù hợp mọi phong cách<br />
            - Cam kết chất lượng, bảo hành uy tín<br />
            - Phù hợp làm quà tặng ý nghĩa cho người thân yêu<br />
            + Trang sức không chỉ là phụ kiện làm đẹp mà còn là biểu tượng của sự tinh tế, sang trọng và cá tính.
            Chúng tôi tự hào mang đến cho bạn những sản phẩm được chế tác tỉ mỉ, giúp tôn vinh vẻ đẹp và khẳng định phong cách riêng.
            Hãy lựa chọn cho mình hoặc người thân những món trang sức tuyệt vời nhất tại cửa hàng của chúng tôi!<br />
          </p>
          <a href="products" className="wrapper__home__content__button">KHÁM PHÁ NGAY</a>
        </div>

        <div className='wrapper__home__image'>
          <div className='wrapper__home__image__rhombus'>
            <img src={newImageProduct} alt="Trang sức cao cấp" />
          </div>
        </div>

        <div className="wrapper__home__rhombus2">
        </div>
      </section>
    </div>
  )
}

HomePage.propTypes = {}

export default HomePage
