FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install -r core/api/requirements.txt && pip install pynacl
ENV PYTHONPATH=/app
CMD ["uvicorn","core.api.node_app:APP","--host","0.0.0.0","--port","8000"]
