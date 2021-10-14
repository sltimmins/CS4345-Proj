# Here we set up the build for the NODE container
# We simply set the working directory within docker and also expose the port to our API, 8000
# Docker compose handles all the cross platform persistence via volumes so we don't need to worry about
#   copying over any of the actual code files for the backend.
FROM golang

RUN mkdir /app
## We copy everything in the root directory
## into our /app directory
ENV GO111MODULE=on

ADD . /app
## We specify that we now wish to execute
## any further commands inside our /app
## directory
WORKDIR /app
# Copy go mod and sum files
COPY go.mod go.sum ./
# Download all dependancies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download
# Copy the source from the current directory to the Working Directory inside the container
COPY . ./
## we run go build to compile the binary
RUN go build -o app app/main.go
## executable of our Go program
CMD ["./app/main"]

EXPOSE $PORT
