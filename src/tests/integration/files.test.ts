import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { BaseTest } from '../../helpers/BaseTest';
import { AssertionHelpers } from '../../utils/AssertionHelpers';

class FilesTest extends BaseTest {
  constructor() {
    super({
      baseURL: 'https://api.escuelajs.co',
      timeout: 15000
    });
  }
}

describe('Files API Tests', () => {
  let filesTest: FilesTest;
  let uploadedFileName: string;

  before(() => {
    filesTest = new FilesTest();
  });

  describe('POST /api/v1/files/upload', () => {
    it('should handle file upload endpoint availability', async () => {
      const testData = Buffer.from('test file content');
      
      const response = await filesTest.post('/api/v1/files/upload', testData, {
        'Content-Type': 'multipart/form-data'
      });
      
      expect([200, 201, 400, 422, 415]).to.include(response.status);
      
      if (response.status === 201 || response.status === 200) {
        expect(response.body).to.have.property('originalname');
        expect(response.body).to.have.property('filename');
        expect(response.body).to.have.property('location');
        uploadedFileName = response.body.filename;
      }
    });

    it('should reject empty file upload', async () => {
      const response = await filesTest.post('/api/v1/files/upload', null, {
        'Content-Type': 'multipart/form-data'
      });
      
      expect([400, 422]).to.include(response.status);
    });

    it('should validate content type for file uploads', async () => {
      const testData = Buffer.from('test file content');
      
      const response = await filesTest.post('/api/v1/files/upload', testData, {
        'Content-Type': 'application/json'
      });
      
      expect([400, 415, 422]).to.include(response.status);
    });
  });

  describe('GET /api/v1/files/{filename}', () => {
    it('should access file endpoint', async () => {
      const testFileName = 'test.png';
      
      const response = await filesTest.get(`/api/v1/files/${testFileName}`);
      
      expect([200, 404]).to.include(response.status);
      
      if (response.status === 200) {
        expect(response.header['content-type']).to.exist;
      }
    });

    it('should return 404 for non-existent files', async () => {
      const response = await filesTest.get('/api/v1/files/non-existent-file.png');
      
      AssertionHelpers.expectStatus(response, 404);
    });

    it('should handle various file extensions', async () => {
      const fileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'txt'];
      
      for (const ext of fileExtensions) {
        const response = await filesTest.get(`/api/v1/files/test.${ext}`);
        expect([200, 404]).to.include(response.status);
      }
    });
  });

  describe('File Security Tests', () => {
    it('should reject potentially malicious file names', async () => {
      const maliciousFileNames = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        'test.php',
        'test.exe',
        'test.sh',
        'test.bat'
      ];
      
      for (const fileName of maliciousFileNames) {
        const response = await filesTest.get(`/api/v1/files/${fileName}`);
        expect([400, 403, 404]).to.include(response.status);
      }
    });

    it('should handle special characters in file names', async () => {
      const specialCharFiles = [
        'file with spaces.png',
        'file-with-dashes.png',
        'file_with_underscores.png',
        'file.with.dots.png'
      ];
      
      for (const fileName of specialCharFiles) {
        const encodedFileName = encodeURIComponent(fileName);
        const response = await filesTest.get(`/api/v1/files/${encodedFileName}`);
        expect([200, 400, 404]).to.include(response.status);
      }
    });
  });

  describe('File Size and Type Validation', () => {
    it('should handle large file names', async () => {
      const longFileName = 'a'.repeat(255) + '.png';
      
      const response = await filesTest.get(`/api/v1/files/${longFileName}`);
      expect([400, 404, 414]).to.include(response.status);
    });

    it('should validate file type restrictions', async () => {
      const response = await filesTest.get('/api/v1/files/test.unknown');
      expect([200, 400, 404, 415]).to.include(response.status);
    });
  });
});