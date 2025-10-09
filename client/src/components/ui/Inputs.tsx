import styled from 'styled-components';

export const Label = styled.label`
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(56, 182, 255, 0.2);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(56, 182, 255, 0.2);
  }
`;

