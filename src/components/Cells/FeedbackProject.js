import React from 'react';
import {
  View, StyleSheet, Text, Image,
} from 'react-native';
import Moment from 'moment';
import SmallRate from '../SmallRate';
import { DATE_TIME_FORMAT, JOB_STATUS, PAY_TYPE } from '../../constants';
import Fonts from '../../theme/Fonts';
import Images from '../../theme/Images';

export default class FeedbackProject extends React.PureComponent {
  render() {
    const { project } = this.props;
    const status = (project && project.status) ? project.status : JOB_STATUS.OPEN;
    const payType = (project && project.payType) ? project.payType : "";

    var price = 0;
    var duration = 0;
    var startDate = "";
    
    if (status === JOB_STATUS.OPEN) {
      startDate = project.createdAt ? Moment(project.createdAt).format(DATE_TIME_FORMAT) : "";
      price = (project && project.initialPrice) ? project.initialPrice : 0;
      duration = (project && project.duration) ? project.duration : 0;
    }
    else {
      startDate = project.hire ? Moment(project.hire.createdAt).format(DATE_TIME_FORMAT) : "";
      price = (project && project.hire && project.hire.price) ? project.hire.price : 0;
      duration = (project && project.hire && project.hire.duration) ? project.hire.duration : 0;
    }

    return (
      <View style={styles.container}>
          { this._renderStatusFlag(status) }
          <Text style={styles.titleText}>{project.title}</Text>
          { 
            // Open Jobs.
            (project.status === JOB_STATUS.OPEN) &&
            <View>
                <Text style={styles.dateText}>{startDate}</Text>
                <Text style={styles.status}>Open</Text>
            </View>
          }

          { 
            // Progress Jobs.
            (project.status === JOB_STATUS.PROGRESSING) &&
            <View>
                <Text style={styles.dateText}>{startDate} - Present</Text>
                <Text style={styles.status}>Job in progress</Text>
            </View>
          }

          { 
            // Completed & Cancelled Jobs.
            (project.status === JOB_STATUS.COMPLETED || project.status === JOB_STATUS.CANCELED) &&
            <View>
                <Text style={styles.dateText}>{startDate} - {Moment(project.completedAt).format(DATE_TIME_FORMAT)}</Text>
                {
                    project.review 
                    ? <View style={{marginTop: 5}}>
                        <SmallRate rate={project.review.score} />
                        <Text style={styles.feedbackText}>{project.review.text}</Text>
                      </View>
                    : <Text style={styles.nofeedbackText}>No feedback given</Text>
                    
                }
            </View>
          }
          
          <View style={styles.priceContainer}>
            {
              (payType === PAY_TYPE.FIXED) 
              ? <Text style={styles.priceText}>${price}</Text>
              : <Text style={styles.priceText}>${price * duration}</Text>
            }

            {
              (payType === PAY_TYPE.FIXED) 
              ? <Text style={styles.priceText}>Fixed-price</Text>
              : <Text style={styles.priceText}>${price} / hr</Text>
            }

            {
              (payType === PAY_TYPE.FIXED) 
              ? <Text style={styles.priceText}>{duration} {duration > 1 ? "days" : "day"}</Text>
              : <Text style={styles.priceText}>{duration} {duration > 1 ? "hours" : "hour"}</Text>
            }
          </View>
      </View>
    );
  }

  _renderStatusFlag(status) {
    var icon = null;
    if (status == JOB_STATUS.PROGRESSING) {
      icon = Images.bookmark_progress;
    }
    else if (status == JOB_STATUS.COMPLETED) {
      icon = Images.bookmark_completed;
    }
    else if (status == JOB_STATUS.CANCELED) {
      icon = Images.bookmark_cancel;
    }

    return (
      <Image source={icon} style={styles.statusFlag} />
    )
  }
}


const styles = StyleSheet.create({
    container: {
      marginVertical: 10,
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 5,
      position: 'relative',
    },

    statusFlag: {
      position: 'absolute',
        right: 5,
        top: 0,
        zIndex: 2,
        width: 40,
        height: 40,
    },

    titleText: {
      fontFamily: Fonts.bold,
      fontSize: 16,
      marginRight: 25,
    },

    dateText: {
        fontFamily: Fonts.light,
        fontSize: 12,
        marginTop: 7,
    },

    status: {
        fontFamily: Fonts.light,
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 5,
    },

    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 7,
    },

    priceText: {
        fontFamily: Fonts.bold,
        color: 'gray',
        marginRight: 30,
        fontSize: 16,
    },

    feedbackText: {
        fontFamily: Fonts.light,
        fontStyle: 'italic',
        marginVertical: 7,
    },

    nofeedbackText: {
        fontFamily: Fonts.regular,
        marginVertical: 7,
    },

});
