import React, { useState } from 'react';
import { Dropdown, Menu, Checkbox, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import './ProductFilter.css';

const FilterViewer = ({ filters = {}, onChange = null }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    materials: filters.materials || [],
    gemstones: filters.gemstones || [],
    priceRanges: filters.priceRanges || [],
    genders: filters.genders || [],
  });

  const [isHovered, setIsHovered] = useState(false);

  const materials = ['Vàng 18K', 'Vàng 24K', 'Bạc', 'Bạch kim'];
  const gemstones = ['Kim cương', 'Ruby', 'Sapphire', 'Ngọc trai'];
  const priceRanges = ['< 5 triệu', '5-10 triệu', '> 10 triệu'];
  const genders = ['Nam', 'Nữ', 'Unisex'];

  const handleFilterChange = (category, value) => {
    const newFilters = {
      ...selectedFilters,
      [category]: value,
    };
    setSelectedFilters(newFilters);

    if (onChange) {
      onChange(newFilters);
    }
  };

  const handleReset = () => {
    const resetFilters = { materials: [], gemstones: [], priceRanges: [], genders: [] };
    setSelectedFilters(resetFilters);
    if (onChange) {
      onChange(resetFilters);
    }
  };

  const filterMenu = (
    <Menu className="filter-menu" style={{ backgroundColor: 'white', borderRadius: '0px', border: '1px solid black' }}>
      <div className="filter-section">
        <Menu.ItemGroup title="Chất liệu">
          {materials.map((material, index) => (
            <Menu.Item key={`material-${index}`}>
              <Checkbox
                checked={selectedFilters.materials.includes(material)}
                onChange={(e) => {
                  const newMaterials = e.target.checked
                    ? [...selectedFilters.materials, material]
                    : selectedFilters.materials.filter(m => m !== material);
                  handleFilterChange('materials', newMaterials);
                }}
              >
                {material}
              </Checkbox>
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </div>
      <div className="filter-section">
        <Menu.ItemGroup title="Đá quý">
          {gemstones.map((gem, index) => (
            <Menu.Item key={`gem-${index}`}>
              <Checkbox
                checked={selectedFilters.gemstones.includes(gem)}
                onChange={(e) => {
                  const newGems = e.target.checked
                    ? [...selectedFilters.gemstones, gem]
                    : selectedFilters.gemstones.filter(g => g !== gem);
                  handleFilterChange('gemstones', newGems);
                }}
              >
                {gem}
              </Checkbox>
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </div>
      <div className="filter-section">
        <Menu.ItemGroup title="Khoảng giá">
          {priceRanges.map((range, index) => (
            <Menu.Item key={`price-${index}`}>
              <Checkbox
                checked={selectedFilters.priceRanges.includes(range)}
                onChange={(e) => {
                  const newRanges = e.target.checked
                    ? [...selectedFilters.priceRanges, range]
                    : selectedFilters.priceRanges.filter(r => r !== range);
                  handleFilterChange('priceRanges', newRanges);
                }}
              >
                {range}
              </Checkbox>
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </div>
      <div className="filter-section">
        <Menu.ItemGroup title="Giới tính">
          {genders.map((gender, index) => (
            <Menu.Item key={`gender-${index}`}>
              <Checkbox
                checked={selectedFilters.genders.includes(gender)}
                onChange={(e) => {
                  const newGenders = e.target.checked
                    ? [...selectedFilters.genders, gender]
                    : selectedFilters.genders.filter(g => g !== gender);
                  handleFilterChange('genders', newGenders);
                }}
              >
                {gender}
              </Checkbox>
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </div>
      <Menu.Divider />
      <Menu.Item>
        <Button type="link" onClick={handleReset} style={{ width: '100%', color: 'black' }}>
          RESET
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="filter-container" style={{ background: 'white', borderRadius: '0px' }}>
      <Dropdown overlay={filterMenu} trigger={['click']} style={{ background: '#eaeaea', borderRadius: '0px' }}>
        <Button
          className="filter-button"
          style={{ background: 'white', borderRadius: 'none' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Filter {isHovered ? <UpOutlined /> : <DownOutlined />}
        </Button>
      </Dropdown>
    </div>
  );
};

export default FilterViewer;
