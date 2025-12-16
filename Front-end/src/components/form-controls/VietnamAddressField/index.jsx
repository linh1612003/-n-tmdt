import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { useField, useFormikContext } from "formik";
import vietnamAddressData from "./vietnamAddressData";

const { Option } = Select;

const VietnamAddressField = ({ name, ...props }) => {
    const [field, meta, helpers] = useField(name);
    const { setFieldValue } = useFormikContext();
    
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Parse giá trị hiện tại nếu có (format: "Phường/Xã, Quận/Huyện, Tỉnh/TP")
    useEffect(() => {
        // Reset state khi field.value thay đổi
        if (!field.value || (typeof field.value === 'string' && !field.value.trim())) {
            setSelectedProvince('');
            setSelectedDistrict('');
            setSelectedWard('');
            setDistricts([]);
            setWards([]);
            return;
        }

        if (typeof field.value === 'string' && field.value.trim()) {
            try {
                const parts = field.value.split(',').map(p => p.trim());
                if (parts.length === 3) {
                    const [ward, district, province] = parts;
                    setSelectedProvince(province);
                    // Tìm và set district, ward tương ứng
                    const provinceData = vietnamAddressData.find(p => p.name === province);
                    if (provinceData) {
                        setDistricts(provinceData.districts);
                        const districtData = provinceData.districts.find(d => d.name === district);
                        if (districtData) {
                            setSelectedDistrict(district);
                            setWards(districtData.wards);
                            const wardData = districtData.wards.find(w => w === ward);
                            if (wardData) {
                                setSelectedWard(ward);
                            }
                        }
                    }
                } else if (parts.length === 2) {
                    // Trường hợp chỉ có Quận/Huyện, Tỉnh/TP
                    const [district, province] = parts;
                    setSelectedProvince(province);
                    const provinceData = vietnamAddressData.find(p => p.name === province);
                    if (provinceData) {
                        setDistricts(provinceData.districts);
                        const districtData = provinceData.districts.find(d => d.name === district);
                        if (districtData) {
                            setSelectedDistrict(district);
                            setWards(districtData.wards);
                        }
                    }
                } else if (parts.length === 1) {
                    // Trường hợp chỉ có Tỉnh/TP
                    const province = parts[0];
                    setSelectedProvince(province);
                    const provinceData = vietnamAddressData.find(p => p.name === province);
                    if (provinceData) {
                        setDistricts(provinceData.districts);
                    }
                }
            } catch (error) {
                console.error('Error parsing address value:', error, 'field.value:', field.value);
            }
        }
    }, [field.value]);

    const handleProvinceChange = (value) => {
        setSelectedProvince(value);
        setSelectedDistrict('');
        setSelectedWard('');
        setWards([]);
        
        const provinceData = vietnamAddressData.find(p => p.name === value);
        if (provinceData) {
            setDistricts(provinceData.districts);
        } else {
            setDistricts([]);
        }
        
        updateAddressValue(value, '', '');
    };

    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        setSelectedWard('');
        
        const provinceData = vietnamAddressData.find(p => p.name === selectedProvince);
        if (provinceData) {
            const districtData = provinceData.districts.find(d => d.name === value);
            if (districtData) {
                setWards(districtData.wards);
            } else {
                setWards([]);
            }
        }
        
        updateAddressValue(selectedProvince, value, '');
    };

    const handleWardChange = (value) => {
        setSelectedWard(value);
        updateAddressValue(selectedProvince, selectedDistrict, value);
    };

    const updateAddressValue = (province, district, ward) => {
        if (province && district && ward) {
            const addressValue = `${ward}, ${district}, ${province}`;
            setFieldValue(name, addressValue);
            helpers.setValue(addressValue);
        } else if (province && district) {
            const addressValue = `${district}, ${province}`;
            setFieldValue(name, addressValue);
            helpers.setValue(addressValue);
        } else if (province) {
            setFieldValue(name, province);
            helpers.setValue(province);
        } else {
            setFieldValue(name, '');
            helpers.setValue('');
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            width: '100%',
        }}>
            <Select
                placeholder="Chọn Tỉnh/Thành phố"
                value={selectedProvince || undefined}
                onChange={handleProvinceChange}
                style={{ 
                    width: '100%', 
                    fontFamily: 'monospace',
                    height: '56px',
                }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {vietnamAddressData.map((province) => (
                    <Option key={province.name} value={province.name}>
                        {province.name}
                    </Option>
                ))}
            </Select>
            
            {selectedProvince && districts.length > 0 && (
                <Select
                    placeholder="Chọn Quận/Huyện"
                    value={selectedDistrict || undefined}
                    onChange={handleDistrictChange}
                    style={{ 
                        width: '100%', 
                        fontFamily: 'monospace',
                        height: '56px',
                    }}
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {districts.map((district) => (
                        <Option key={district.name} value={district.name}>
                            {district.name}
                        </Option>
                    ))}
                </Select>
            )}
            
            {selectedDistrict && wards.length > 0 && (
                <Select
                    placeholder="Chọn Phường/Xã"
                    value={selectedWard || undefined}
                    onChange={handleWardChange}
                    style={{ 
                        width: '100%', 
                        fontFamily: 'monospace',
                        height: '56px',
                    }}
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {wards.map((ward) => (
                        <Option key={ward} value={ward}>
                            {ward}
                        </Option>
                    ))}
                </Select>
            )}
        </div>
    );
};

export default VietnamAddressField;

