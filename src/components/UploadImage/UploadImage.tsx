/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Upload, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const UploadWithServer: React.FC = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    // Xử lý hiển thị ảnh preview
    const handlePreview = async (file: any) => {
        setPreviewImage(file.thumbUrl || file.url);
        setPreviewOpen(true);
    };

    // Xử lý thêm file vào danh sách (không gửi lên server ngay)
    const handleChange = ({ fileList }: any) => {
        setFileList(fileList);
    };

    // Gửi tất cả file lên server
    const handleUploadToServer = async () => {
        if (fileList.length === 0) {
            message.warning('Chưa có file nào để gửi lên server!');
            return;
        }

        try {
            const uploadedFiles = [];
            for (const file of fileList) {
                const fileObj = file.originFileObj;

                // Chuyển file thành base64
                const reader = new FileReader();
                reader.readAsDataURL(fileObj);
                const base64 = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = (error) => reject(error);
                });

                // Gửi base64 lên server
                await axios.post('http://localhost:3000/images', { url: base64 });
                uploadedFiles.push(base64);
            }

            message.success('Tất cả file đã được gửi lên server!');
        } catch (error) {
            message.error('Có lỗi xảy ra khi gửi file lên server!');
        }
    };

    // Hiển thị file từ server
    const handleShowFiles = async () => {
        try {
            const response = await axios.get('http://localhost:3000/images');
            const images = response.data;

            if (images.length > 0) {
                setUploadedImages(images.map((image: any) => image.url)); // Lấy tất cả file
                message.success('Tất cả file đã được hiển thị!');
            } else {
                message.warning('Không có file nào trên server!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi lấy dữ liệu từ server!');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Upload
                listType="picture-card"
                onPreview={handlePreview}
                onChange={handleChange}
                fileList={fileList}
                beforeUpload={() => false} // Chặn auto-upload
                multiple // Cho phép chọn nhiều file
                maxCount={1}
            >
                {fileList.length >= 8 ? null : (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Chọn file</div>
                    </div>
                )}
            </Upload>

            <Button type="primary" onClick={handleUploadToServer} style={{ marginTop: '10px', marginRight: '10px' }}>
                Gửi tất cả file lên server
            </Button>
            <Button onClick={handleShowFiles} style={{ marginTop: '10px' }}>
                Hiển thị tất cả file
            </Button>

            {uploadedImages.length > 0 && (
                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {uploadedImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Uploaded Preview ${index + 1}`}
                            style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px' }}
                        />
                    ))}
                </div>
            )}

            {/* Modal xem preview */}
            <Modal visible={previewOpen} title="Xem trước ảnh" footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default UploadWithServer;
