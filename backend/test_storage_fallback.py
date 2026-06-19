from backend.app.storage import upload_file, delete_object, UPLOAD_DIR

if __name__ == '__main__':
    object_name = 'test_upload.txt'
    payload = b'hello world'
    result = upload_file(object_name, payload, 'text/plain')
    print('upload result:', result)
    print('exists:', UPLOAD_DIR.joinpath(object_name).exists())
    delete_object(object_name)
    print('deleted:', not UPLOAD_DIR.joinpath(object_name).exists())
