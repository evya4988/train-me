import React from 'react';
import './Img.css';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
// import { Transformation } from "@cloudinary/url-gen";

// Import required actions.
// another option to check: scale, fill
import { thumbnail, scale, fill } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
// import { sepia } from "@cloudinary/url-gen/actions/effect";
// import { source } from "@cloudinary/url-gen/actions/overlay";
import { opacity, brightness } from "@cloudinary/url-gen/actions/adjust";
import { byAngle } from "@cloudinary/url-gen/actions/rotate"

// Import required qualifiers.
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { face, FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
// import { image } from "@cloudinary/url-gen/qualifiers/source";
// import { Position } from "@cloudinary/url-gen/qualifiers/position";
// import { compass } from "@cloudinary/url-gen/qualifiers/gravity";


// Import plugins
// import { lazyload, placeholder } from '@cloudinary/react';

const Img = (props) => {
  const { adminAvatar,
    customerAvatar,
    trainerAvatar,
    courseAvatar,
    customersDisplayAvatar,
    trainersDisplayAvatar,
    courseTrainerAvatar,
    customerCoursePageAvatar,
    usersIconAvatar
  } = props;
  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'train-me'
    }
  });

  // Use the image with public ID, 'front_face'.
  const adminImage = cld.image(adminAvatar);
  adminImage
    .resize(thumbnail().width(150).height(150).gravity(focusOn(face())))  // Crop the image.
    .roundCorners(byRadius(30))   // Round the corners.
    .rotate(byAngle(12)).backgroundColor("whitesmoke");
  //     .offsetX(expression("width / 50"))
  //     .offsetY(expression("width / 50"))
  // );

  const customerImage = cld.image(customerAvatar);
  customerImage
    .resize(fill().width(150).height(150).gravity(focusOn(face())))  // Crop the image.
    .roundCorners(byRadius(30))   // Round the corners.
    .rotate(byAngle(12)).backgroundColor("whitesmoke");

  const trainerImage = cld.image(trainerAvatar);
  trainerImage
    .resize(thumbnail().width(150).height(150).gravity(focusOn(face())))  // Crop the image.
    .roundCorners(byRadius(30))   // Round the corners.
    .rotate(byAngle(12)).backgroundColor("whitesmoke");

  const courseImage = cld.image(courseAvatar);
  courseImage
    .resize(thumbnail().width(300).height(300));  // Crop the image.

  const customersImage = cld.image(customersDisplayAvatar);
  customersImage
    .resize(thumbnail().width(300).height(300));

  const trainersImage = cld.image(trainersDisplayAvatar);
  trainersImage
    .resize(thumbnail().width(300).height(300));

  const courseTrainerImage = cld.image(courseTrainerAvatar);
  courseTrainerImage
    .resize(thumbnail().width(200).height(200).gravity(focusOn(face())))
    .roundCorners(byRadius(30));

  const customerCoursePageImage = cld.image(customerCoursePageAvatar);
  customerCoursePageImage
    .resize(scale().width(1200).height(1200))
    .roundCorners(byRadius(20));

  const usersIconImage = cld.image(usersIconAvatar);
  usersIconImage
    // .border("1px_solid_black")
    .effect(opacity(100))
    .effect(brightness(10))
    .resize(thumbnail().width(40).height(40).gravity(focusOn(face())))
    .roundCorners(byRadius("max"))
    .rotate(byAngle(12))
    .backgroundColor("whitesmoke")


  return (
    <>
      {adminAvatar &&
        <AdvancedImage
          className="c-image"
          cldImg={adminImage}
        // plugins={[lazyload(), placeholder({ mode: 'predominant-color' })]}
        />}
      {customerAvatar &&
        <AdvancedImage
          className="c-image"
          cldImg={customerImage}
        />}
      {trainerAvatar &&
        <AdvancedImage
          className="c-image"
          cldImg={trainerImage}
        />}
      {courseAvatar &&
        <AdvancedImage
          className="course-image"
          cldImg={courseImage}
        />}
      {customersDisplayAvatar &&
        <AdvancedImage
          className="course-image"
          cldImg={customersImage}
        />}
      {trainersDisplayAvatar &&
        <AdvancedImage
          className="course-image"
          cldImg={trainersImage}
        />}
      {courseTrainerAvatar &&
        <AdvancedImage
          className="course-display-trainer-image"
          cldImg={courseTrainerImage}
        />}
      {customerCoursePageAvatar &&
        <AdvancedImage
          className="customer-display-coursePageImage"
          cldImg={customerCoursePageImage}
        />}
      {usersIconAvatar &&
        <AdvancedImage
          // className="icon-image"
          cldImg={usersIconImage}
        />}
    </>
  )
}

export default Img;
