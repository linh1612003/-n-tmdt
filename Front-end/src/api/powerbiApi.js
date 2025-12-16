import axiosClient from './axiosClient';

const powerbiApi = {
    getDatasets() {
        const url = '/api/powerbi/datasets';
        return axiosClient.get(url);
    },

    getReportData(startDate, endDate) {
        const url = '/api/powerbi/report-data';
        const params = {
            startDate,
            endDate,
        };
        return axiosClient.get(url, { params });
    },
};

export default powerbiApi;


