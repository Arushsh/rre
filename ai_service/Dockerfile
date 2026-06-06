FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required for dlib and face_recognition
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    && rm -rf /var/lib/apt/lists/*

# Limit compilation threads to 1 to prevent Render from running out of memory (8GB limit)
ENV CMAKE_BUILD_PARALLEL_LEVEL=1
ENV DLIB_MAKE_ARGS="-j 1"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir cmake
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
