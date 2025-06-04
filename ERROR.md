# Known Issues and Errors Document

> This document provides troubleshooting information for common issues encountered in **Self Study 1**. To address issues quickly follow the documented resolutions. If you encounter a new issue that is not listed in this document, please contribute by adding it to the document following the provided template.

---

## Table of Contents

1. [How to Use This Document](#how-to-use-this-document)
2. [Error Documentation Template](#error-documentation-template)

---

## How to Use This Document

This document is intended for two primary uses:

1. **To troubleshoot an issue you encounter during development.** Search the document for similar error messages and follow the provided resolutions if available.
2. **To document a new issue you resolved.** If you encounter a new, undocumented issue and resolve it, please document it here using the [Error Documentation Template](#error-documentation-template) for future reference.

---

### 1. I Encountered an Issue While Developing

If you’ve encountered an issue, start by searching for it in this document:

- **Use `CTRL-F` or `CMD-F`** to open your browser's search functionality.
- **Paste part of the error message** or keywords from the issue.
- Review matching entries to see if there is a documented solution.

### 2. I Resolved a New Issue and Want to Document It

If you encountered and resolved a new issue that isn’t yet in this document:

1. Copy and paste the [Error Documentation Template](#error-documentation-template) below to a new entry in this document.
2. Provide all relevant details about the issue and the steps you took to resolve it.

---

## Error Documentation Template

> Use this template to document any new issues you encounter and resolve. Include as much detail as possible to make troubleshooting easier for future developers.

### Descriptive Headline (include key error message details if applicable)

> This template ensures consistent documentation, making it easy for others to follow and contribute to this document.

<details>
  <summary>Full Error Message - Click to Expand</summary>

  ```sh
  # Paste the full error message here, wrapped in code block formatting.
  # Modify language or format if necessary for readability.
  ```

</details>

----

**Description**: Provide a brief description of the error and its impact.

**Affected Systems**: List the environments and dependencies affected (e.g., Node.js version, Docker configuration).

**Steps to Reproduce**: Document the steps needed to reproduce the issue.
  - Step 1: ...
  - Step 2: ...
  - Step 3: ...

**Resolution/Workaround**: Detail the steps to resolve the issue or any known workarounds.
  - Step 1: ...
  - Step 2: ...
  - Step 3: ...

**Date Added**: Record the date for tracking updates.

## port is already allocated

<details>
  <summary>Full Error Message - Click to Expand</summary>

  ```sh
  Error response from daemon: driver failed programming external connectivity on endpoint example-database-1 (a0a9dd2c2dc0500fdf9fbf026620aed410240980f312b56f1c53c5a1be94247b): Bind for 127.0.0.1:5432 failed: port is already allocated
  ```

</details>

----

**Description**: If you run `npm run setup:dev` or `docker compose up` and encounter this error or a similar with a different port, it is likely you have another container running that is already using the port.

**Affected Systems**: ---

**Steps to Reproduce**: This is just an example how this could happen, there are propably other reasons for that as well, e.g. using a database in another project...
  - Step 1: `docker compose up`
  - Step 2: `npm run setup:dev`

**Resolution/Workaround**:
  - Step 1: `docker container ls`
  - Step 2: find the container thats allocating the port
  - Step 3: `docker stop <container-id> && docker rm <container-id> `

## Connection Failed with Docker Run and Missing Environment Variables

<details>
  <summary>Full Error Message - Click to Expand</summary>

  ```sh
  Error: P1001: Can't reach database server at `database`:`5432`

  Please make sure your database server is running at `database`:`5432`.
  ```

</details>

----

**Description**: When running the application using `docker run` directly (instead of Docker Compose), you may encounter database connection errors. This happens because the necessary environment variables are not being passed to the container.

**Affected Systems**: Docker container running with `docker run` command

**Steps to Reproduce**: 
  - Step 1: Pull the image from Docker Hub: `docker pull mkaltenr/example-git:latest`
  - Step 2: Run the container without environment variables: `docker run -d -p 127.0.0.1:5000:5000 --name class9-example mkaltenr/example-git:latest`
  - Step 3: Try to access the API at http://localhost:5000/ping

**Resolution/Workaround**:
  - Option 1: Use Docker Compose which handles environment variables automatically:
    ```sh
    docker compose up -d
    ```
  
  - Option 2: Pass necessary environment variables when using docker run:
    ```sh
    docker run -d -p 127.0.0.1:5000:5000 --name class9-example -e HOST=0.0.0.0 -e DATABASE_URL=postgresql://username:password@host:5432/db_name mkaltenr/example-git:latest
    ```
  
  - Option 3: Create an environment file and reference it:
    ```sh
    docker run -d -p 127.0.0.1:5000:5000 --name class9-example --env-file .env mkaltenr/example-git:latest
    ```

## GitHub Actions Pipeline Fails with Version Incompatibility

<details>
  <summary>Full Error Message - Click to Expand</summary>

  ```
  Error: actions/download-artifact@v3 deprecated.
  ```

</details>

----

**Description**: The GitHub Actions workflow fails during the artifact download or upload steps due to deprecation of the version.

**Affected Systems**: GitHub Actions CI/CD pipeline

**Steps to Reproduce**: 
  - Step 1: Push changes to trigger the GitHub Actions workflow
  - Step 2: The workflow fails in the Push Stage when trying to download the artifact
  - Step 3: Check the workflow logs and see the error about artifact not found

**Resolution/Workaround**: 
  - Step 1: Open the `.github/workflows/build-test-push.yaml` file
  - Step 2: Make sure both upload and download artifact actions use the same version and most recent (v4):
    ```yaml
    # In the build job
    - name: Upload artifact
      uses: actions/upload-artifact@v4
      with:
        name: docker-image
        path: image.tar
        retention-days: 1
    
    # In the push job
    - name: Download artifact
      uses: actions/download-artifact@v4
      with:
        name: docker-image
    ```
  - Step 3: Commit and push the changes to trigger the workflow again
