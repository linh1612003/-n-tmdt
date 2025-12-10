import React from 'react';
import PropTypes from 'prop-types';
import '../AboutCompany/style.scss';

function AboutCompany(props) {
    return (
        <div>
            {/* Container 1 */}
            <div className='aban'>
                <div className='aban__wrap'>
                    <div className='aban__bg'>
                        <img
                            style={{ height: "fitContent" }}
                            src='https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80'
                            alt='About Company'
                        />
                    </div>
                    <div className='container'>
                        <div className='aban__inner'>
                            <div className='aban__ctn' data-aos='zoom-in'>
                                <span className='aban__text'>/HANIE JEWELRY/</span>
                                <h1 className='aban__title'>TRANG SỨC CAO CẤP HANIE</h1>
                                <p className='aban__desc'>
                                    Hanie Jewelry là thương hiệu trang sức cao cấp hàng đầu Việt Nam, chuyên cung cấp các sản phẩm nhẫn, vòng cổ, bông tai, lắc tay... được chế tác tinh xảo từ vàng, bạc, bạch kim và các loại đá quý tự nhiên. Chúng tôi cam kết mang đến cho khách hàng những trải nghiệm đẳng cấp, sang trọng và khác biệt qua từng sản phẩm.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Container 2 */}
            <div className='aban2'>
                <div className='aban2__flex'>
                    <div className='aban2__left1'>
                        <div className='aban2__desc'>
                            <div className='aban2__title-content'>
                                <h2 className='aban2__title '>LỊCH SỬ HÌNH THÀNH & PHÁT TRIỂN</h2>
                                <div className='aban2__desc2 '>
                                    <p>
                                        Được thành lập từ năm 2010, Hanie Jewelry không ngừng phát triển và khẳng định vị thế trên thị trường trang sức Việt Nam. Với đội ngũ nghệ nhân lành nghề, chúng tôi tự hào mang đến những thiết kế độc quyền, kết hợp giữa truyền thống và hiện đại, đáp ứng mọi nhu cầu làm đẹp và khẳng định phong cách cá nhân của khách hàng.

                                        Sứ mệnh của Hanie là tôn vinh vẻ đẹp, giá trị và cảm xúc qua từng món trang sức, đồng hành cùng khách hàng trong những khoảnh khắc ý nghĩa nhất của cuộc đời.

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='aban2__right1'>
                        <div className='aban2__img' >
                            <div className='aban2__box'>
                                <img
                                    src='https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=900&q=80'
                                    alt='Trang sức Hanie'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='aban2__flex' style={{ height: "500px" }}>
                    <div className='aban2__left2' style={{ height: "500px" }}>
                        <div className='aban2__img' data-aos='zoom-in' style={{ height: "500px" }}>
                            <div className='aban2__box' style={{ height: "500px" }}>
                                <img
                                    style={{ height: "fitContent" }}
                                    src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80'
                                    alt='Nghệ nhân chế tác trang sức'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='aban2__right2'>
                        <div className='aban2__desc' data-aos='fade-up'>
                            <div className='aban2__title-content'>
                                <h2 className='aban2__title f-title fw-7 t-center'>GIÁ TRỊ CỐT LÕI</h2>
                                <div className='aban2__desc2 fw-5 t16 t-center mona-content'>
                                    <p>
                                        Hanie Jewelry đặt chất lượng và sự hài lòng của khách hàng lên hàng đầu. Mỗi sản phẩm đều trải qua quy trình kiểm định nghiêm ngặt, đảm bảo độ tinh xảo, bền đẹp và an toàn cho người sử dụng. Chúng tôi luôn đổi mới sáng tạo, cập nhật xu hướng thời trang thế giới để mang đến những bộ sưu tập trang sức độc đáo, sang trọng và ý nghĩa nhất.
                                        <br />
                                        "Tỏa sáng cùng đẳng cấp - Gắn kết yêu thương" là phương châm mà Hanie Jewelry luôn hướng tới trong từng sản phẩm và dịch vụ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

AboutCompany.propTypes = {};

export default AboutCompany;
