import jwt from 'jsonwebtoken';

export const errorResponse = (errors, statusCode, response) => response.status(statusCode).json({
  success: false,
  errors
});

export const trimData = (documentData) => {
  const dataValue = documentData;
  Object.keys(documentData)
    .forEach((key) => {
      dataValue[key] = dataValue[key].trim();
    });
  return dataValue;
};

export const generateToken = async (user) => {
  const token = await jwt.sign(
    { id: user.id, firstName: user.name.split(' ')[0] },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return token;
};
