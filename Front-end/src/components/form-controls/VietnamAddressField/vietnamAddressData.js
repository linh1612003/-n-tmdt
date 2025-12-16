// Dữ liệu địa chỉ hành chính Việt Nam (theo hệ thống cũ)
// Bao gồm các tỉnh/thành phố chính với quận/huyện và phường/xã

const vietnamAddressData = [
    {
        name: "Hà Nội",
        districts: [
            {
                name: "Quận Ba Đình",
                wards: ["Phường Cống Vị", "Phường Điện Biên", "Phường Đội Cấn", "Phường Giảng Võ", "Phường Kim Mã", "Phường Liễu Giai", "Phường Ngọc Hà", "Phường Ngọc Khánh", "Phường Nguyễn Trung Trực", "Phường Phúc Xá", "Phường Quán Thánh", "Phường Thành Công", "Phường Trúc Bạch", "Phường Vĩnh Phúc"]
            },
            {
                name: "Quận Hoàn Kiếm",
                wards: ["Phường Chương Dương", "Phường Cửa Đông", "Phường Cửa Nam", "Phường Đồng Xuân", "Phường Hàng Bạc", "Phường Hàng Bồ", "Phường Hàng Bông", "Phường Hàng Buồm", "Phường Hàng Đào", "Phường Hàng Gai", "Phường Hàng Mã", "Phường Hàng Trống", "Phường Lý Thái Tổ", "Phường Phan Chu Trinh", "Phường Phúc Tân", "Phường Trần Hưng Đạo"]
            },
            {
                name: "Quận Hai Bà Trưng",
                wards: ["Phường Bách Khoa", "Phường Bạch Đằng", "Phường Bạch Mai", "Phường Cầu Dền", "Phường Đống Mác", "Phường Đồng Nhân", "Phường Đồng Tâm", "Phường Lê Đại Hành", "Phường Minh Khai", "Phường Nguyễn Du", "Phường Phạm Đình Hổ", "Phường Phố Huế", "Phường Quỳnh Lôi", "Phường Quỳnh Mai", "Phường Thanh Lương", "Phường Thanh Nhàn", "Phường Trương Định", "Phường Vĩnh Tuy"]
            },
            {
                name: "Quận Đống Đa",
                wards: ["Phường Cát Linh", "Phường Hàng Bột", "Phường Khâm Thiên", "Phường Khương Thượng", "Phường Kim Liên", "Phường Láng Hạ", "Phường Láng Thượng", "Phường Nam Đồng", "Phường Ngã Tư Sở", "Phường Ô Chợ Dừa", "Phường Phương Liên", "Phường Phương Mai", "Phường Quang Trung", "Phường Quốc Tử Giám", "Phường Thịnh Quang", "Phường Thổ Quan", "Phường Trung Liệt", "Phường Trung Phụng", "Phường Trung Tự", "Phường Văn Chương", "Phường Văn Miếu"]
            },
            {
                name: "Quận Hoàng Mai",
                wards: ["Phường Đại Kim", "Phường Định Công", "Phường Giáp Bát", "Phường Hoàng Liệt", "Phường Hoàng Văn Thụ", "Phường Lĩnh Nam", "Phường Mai Động", "Phường Tân Mai", "Phường Thanh Trì", "Phường Thịnh Liệt", "Phường Trần Phú", "Phường Tương Mai", "Phường Vĩnh Hưng", "Phường Yên Sở"]
            },
            {
                name: "Quận Long Biên",
                wards: ["Phường Bồ Đề", "Phường Cự Khối", "Phường Đức Giang", "Phường Gia Thụy", "Phường Giang Biên", "Phường Long Biên", "Phường Ngọc Lâm", "Phường Ngọc Thụy", "Phường Phúc Đồng", "Phường Phúc Lợi", "Phường Sài Đồng", "Phường Thạch Bàn", "Phường Thượng Thanh", "Phường Việt Hưng"]
            }
        ]
    },
    {
        name: "TP. Hồ Chí Minh",
        districts: [
            {
                name: "Quận 1",
                wards: ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh", "Phường Cô Giang", "Phường Đa Kao", "Phường Nguyễn Cư Trinh", "Phường Nguyễn Thái Bình", "Phường Phạm Ngũ Lão", "Phường Tân Định"]
            },
            {
                name: "Quận 3",
                wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14"]
            },
            {
                name: "Quận Bình Thạnh",
                wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 5", "Phường 6", "Phường 7", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 17", "Phường 19", "Phường 21", "Phường 22", "Phường 24", "Phường 25", "Phường 26", "Phường 27", "Phường 28"]
            },
            {
                name: "Quận Tân Bình",
                wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"]
            }
        ]
    },
    {
        name: "Đà Nẵng",
        districts: [
            {
                name: "Quận Hải Châu",
                wards: ["Phường Bình Hiên", "Phường Bình Thuận", "Phường Hải Châu I", "Phường Hải Châu II", "Phường Hòa Cường Bắc", "Phường Hòa Cường Nam", "Phường Hòa Thuận Đông", "Phường Hòa Thuận Tây", "Phường Nam Dương", "Phường Phước Ninh", "Phường Thạch Thang", "Phường Thanh Bình", "Phường Thuận Phước"]
            },
            {
                name: "Quận Thanh Khê",
                wards: ["Phường An Khê", "Phường Chính Gián", "Phường Hòa Khê", "Phường Tam Thuận", "Phường Tân Chính", "Phường Thạch Thang", "Phường Thanh Khê Đông", "Phường Thanh Khê Tây", "Phường Vĩnh Trung", "Phường Xuân Hà"]
            }
        ]
    },
    {
        name: "Hải Phòng",
        districts: [
            {
                name: "Quận Hồng Bàng",
                wards: ["Phường Hạ Lý", "Phường Hoàng Văn Thụ", "Phường Hùng Vương", "Phường Minh Khai", "Phường Phạm Hồng Thái", "Phường Phan Bội Châu", "Phường Quán Toan", "Phường Quang Trung", "Phường Sở Dầu", "Phường Thượng Lý", "Phường Trại Chuối"]
            },
            {
                name: "Quận Ngô Quyền",
                wards: ["Phường Cầu Đất", "Phường Cầu Tre", "Phường Đằng Giang", "Phường Đông Khê", "Phường Đổng Quốc Bình", "Phường Gia Viên", "Phường Lạch Tray", "Phường Lạch Viên", "Phường Lê Lợi", "Phường Máy Chai", "Phường Máy Tơ", "Phường Vạn Mỹ"]
            }
        ]
    },
    {
        name: "Cần Thơ",
        districts: [
            {
                name: "Quận Ninh Kiều",
                wards: ["Phường An Hòa", "Phường An Khánh", "Phường An Lạc", "Phường An Nghiệp", "Phường An Phú", "Phường An Thới", "Phường Bùi Hữu Nghĩa", "Phường Cái Khế", "Phường Hưng Lợi", "Phường Tân An", "Phường Thới Bình", "Phường Xuân Khánh"]
            }
        ]
    },
    {
        name: "An Giang",
        districts: [
            {
                name: "Thành phố Long Xuyên",
                wards: ["Phường Bình Đức", "Phường Bình Khánh", "Phường Đông Xuyên", "Phường Mỹ Bình", "Phường Mỹ Long", "Phường Mỹ Phước", "Phường Mỹ Quý", "Phường Mỹ Thạnh", "Phường Mỹ Thới", "Phường Mỹ Xuyên"]
            }
        ]
    },
    {
        name: "Bà Rịa - Vũng Tàu",
        districts: [
            {
                name: "Thành phố Vũng Tàu",
                wards: ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường Thắng Nhất", "Phường Thắng Nhì", "Phường Thắng Tam"]
            }
        ]
    },
    {
        name: "Bình Dương",
        districts: [
            {
                name: "Thành phố Thủ Dầu Một",
                wards: ["Phường Chánh Mỹ", "Phường Chánh Nghĩa", "Phường Định Hòa", "Phường Hiệp An", "Phường Hiệp Thành", "Phường Hòa Phú", "Phường Phú Cường", "Phường Phú Hòa", "Phường Phú Lợi", "Phường Phú Mỹ", "Phường Phú Tân", "Phường Phú Thọ", "Phường Tân An", "Phường Tương Bình Hiệp"]
            }
        ]
    },
    {
        name: "Đồng Nai",
        districts: [
            {
                name: "Thành phố Biên Hòa",
                wards: ["Phường An Bình", "Phường An Hòa", "Phường Bình Đa", "Phường Bửu Hòa", "Phường Bửu Long", "Phường Hố Nai", "Phường Hóa An", "Phường Long Bình", "Phường Long Bình Tân", "Phường Phước Tân", "Phường Quang Vinh", "Phường Quyết Thắng", "Phường Tam Hiệp", "Phường Tam Hòa", "Phường Tân Biên", "Phường Tân Hạnh", "Phường Tân Hiệp", "Phường Tân Hòa", "Phường Tân Mai", "Phường Tân Phong", "Phường Tân Tiến", "Phường Tân Vạn", "Phường Thanh Bình", "Phường Thống Nhất", "Phường Trảng Dài"]
            }
        ]
    },
    {
        name: "Khánh Hòa",
        districts: [
            {
                name: "Thành phố Nha Trang",
                wards: ["Phường Lộc Thọ", "Phường Ngọc Hiệp", "Phường Phước Hải", "Phường Phước Hòa", "Phường Phước Long", "Phường Phước Tân", "Phường Phước Tiến", "Phường Phương Sài", "Phường Phương Sơn", "Phường Tân Lập", "Phường Vạn Thắng", "Phường Vạn Thạnh", "Phường Vĩnh Hải", "Phường Vĩnh Hòa", "Phường Vĩnh Nguyên", "Phường Vĩnh Phước", "Phường Vĩnh Thọ", "Phường Vĩnh Trường", "Phường Xương Huân"]
            }
        ]
    }
];

export default vietnamAddressData;

