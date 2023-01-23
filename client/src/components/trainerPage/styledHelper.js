
import styled from "styled-components";

export const FileInput = styled.input`
  width: 80%;
  height: 32px;
  outline: none;
  border-bottom: 1.4px solid transparent;
  transition: all 1000ms ease-in-out;
  font-size: 12px;
  /* margin-top: 0.8em; */

  &:not(:last-of-type) {
    border-bottom: 1.5px solid rgba(200, 200, 200, 0.4);
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid rgb(241, 196, 15);
  }

  ::file-selector-button {
    font-weight: bold;
    color: white;
    background-color: rgb(120, 167, 255);
    padding: 0.4em;
    border: thin solid lightblue;
    border-radius: 10px;
}

::file-selector-button:hover {
  /* background-color: rgb(241, 196, 15); */
    background-color: white;
    color: dodgerblue;
}
`;

export const PreviewPicture = styled.img`
    width: 14em;
    height: 14em;
    border-radius: 20%;
    margin-top: 2em;
`