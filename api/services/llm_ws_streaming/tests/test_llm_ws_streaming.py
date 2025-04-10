from services.llm_ws_streaming.llm_ws_streaming_service import process

def test_llm_ws_streaming_process():
    response = process()
    assert response == {"message": "Response from llm_ws_streaming"}
